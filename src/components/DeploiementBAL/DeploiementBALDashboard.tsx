"use client";

import AutocompleteInput from "@/components/Autocomplete/AutocompleteInput";
import {
  DeploiementBALSearchResult,
  DeploiementBALSearchResultDepartement,
  useStatsDeploiement,
} from "@/hooks/useStatsDeploiement";
import { getEpcis } from "@/lib/api-geo";
import { BANStats } from "@/types/api-ban.types";
import { Departement } from "@/types/api-geo.types";
import { useCallback, useEffect, useState } from "react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import TabDeploiementBAL from "./TabDeploiementBAL";
import { StyledDeploiementBALDashboard } from "./DeploiementBALDashboard.styles";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import DeploiementMap, { getStyle } from "./DeploiementMap";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { mapToSearchResult } from "@/lib/deploiement-search";
import { FullScreenControl } from "../Map/FullScreenControl";
import { getSuiviBanTilesTemplateUrl } from "@/lib/suivi-ban-api";
import { useSuiviBan } from "./useSuiviBan";
import { SuiviBanMapLayers } from "./SuiviBanMapLayers";
import { SuiviBanOverlay } from "./SuiviBanOverlay";

const getInitalTab = (
  searchParams: ReadonlyURLSearchParams | null,
): "source-bal" | "suivi-ban" | null => {
  const tabId =
    Array.from(searchParams?.entries() || []).find(
      ([searchParam]) => searchParam === "tab",
    )?.[1] || null;
  if (tabId && ["source-bal", "suivi-ban"].includes(tabId)) {
    return tabId as "source-bal" | "suivi-ban";
  }
  return null;
};

interface DeploiementBALMapProps {
  initialStats: BANStats;
  initialFilter: DeploiementBALSearchResult | null;
  departements: (Departement & {
    centre: { type: string; coordinates: number[] };
  })[];
}

export default function DeploiementBALMap({
  initialStats,
  initialFilter,
  departements,
}: DeploiementBALMapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    stats,
    formatedStats,
    filter,
    setFilter,
    filteredCodesCommmune,
    geometry,
  } = useStatsDeploiement({ initialStats, initialFilter });
  const [selectedTab, setSelectedTab] = useState<"source-bal" | "suivi-ban">(
    getInitalTab(searchParams) || "source-bal",
  );
  const [origin, setOrigin] = useState("");

  const suivi = useSuiviBan({ selectedTab });
  const {
    mapRef,
    mapContainerRef,
    interactiveLayerIds,
    suiviBanSelectedDept,
    handleMapClick,
    restoreSuiviBanView,
  } = suivi;

  useEffect(() => {
    const changeOrigin = () => {
      setOrigin(window.location.origin);
    };
    changeOrigin();
  }, []);

  // Panel gauche à chaque fois ; recentrage France/zoom 5 uniquement au premier passage sur l’onglet (session).
  const SUIVI_BAN_PANEL_WIDTH = 370;
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (selectedTab === "suivi-ban") {
      map.setPadding({
        left: SUIVI_BAN_PANEL_WIDTH,
        top: 0,
        right: 0,
        bottom: 0,
      });
      if (suiviBanSelectedDept) {
        restoreSuiviBanView();
      } else {
        map.easeTo({
          center: [2, 47],
          zoom: 4.64,
          duration: 800,
        });
      }
    } else {
      map.setPadding({ left: 0, top: 0, right: 0, bottom: 0 });
    }
  }, [selectedTab, mapRef, suiviBanSelectedDept, restoreSuiviBanView]);

  const handleSearch = useCallback(
    async (input: string) => {
      const filteredEpcis = await getEpcis({
        q: input,
        limit: 10,
        fields: ["centre", "contour"],
      });
      const filteredDepartements = departements.filter(({ nom }) =>
        nom.toLowerCase().includes(input.toLowerCase()),
      );

      return [
        ...mapToSearchResult(filteredEpcis, "EPCI"),
        ...mapToSearchResult(filteredDepartements, "Département"),
      ];
    },
    [departements],
  );

  const handleFilter = useCallback(
    (filter: DeploiementBALSearchResult | null) => {
      // Update URL
      const current = new URLSearchParams(
        Array.from(searchParams?.entries() || []),
      );
      current.delete("epci");
      current.delete("departement");
      if (filter) {
        if (filter.type === "EPCI") {
          current.set("epci", filter.code);
        } else if (filter.type === "Département") {
          current.set("departement", filter.code);
        }
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
      setFilter(filter);
    },
    [setFilter, pathname, searchParams, router],
  );

  const handleTabChange = useCallback(
    (tabId: string) => {
      const current = new URLSearchParams(
        Array.from(searchParams?.entries() || []),
      );
      current.set("tab", tabId);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
      setSelectedTab(tabId as "source-bal" | "suivi-ban");
    },
    [pathname, searchParams, router],
  );

  const handleTerritorySelect = useCallback(
    (codeTerritory: string) => {
      const filteredDepartement = departements.find(
        ({ code }) => code === codeTerritory,
      );

      if (filteredDepartement) {
        const filter: DeploiementBALSearchResultDepartement = {
          type: "Département",
          code: filteredDepartement.code,
          nom: filteredDepartement.nom,
          center: filteredDepartement.centre as {
            type: string;
            coordinates: [number, number];
          },
        };

        handleFilter(filter);
      }
    },
    [departements, handleFilter],
  );

  return (
    <StyledDeploiementBALDashboard>
      <div className="map-stats-container" id="map-stat">
        <div className="stats-wrapper">
          <Tabs
            selectedTabId={selectedTab}
            tabs={[
              { tabId: "source-bal", label: "Déploiement BAL" },
              { tabId: "suivi-ban", label: "Déploiement id BAN" },
            ]}
            onTabChange={handleTabChange}
          >
            <div
              ref={mapContainerRef}
              className="bal-cover-map-container"
              style={{
                position: "relative",
                height: selectedTab === "suivi-ban" ? 650 : undefined,
              }}
            >
              <Map
                ref={mapRef}
                initialViewState={{
                  longitude: 2,
                  latitude: 47,
                  zoom: 5,
                }}
                renderWorldCopies={false}
                mapStyle="/map-styles/osm-vector.json"
                onClick={handleMapClick}
                interactiveLayerIds={
                  selectedTab === "suivi-ban" ? interactiveLayerIds : []
                }
                cursor={selectedTab === "suivi-ban" ? "pointer" : "auto"}
              >
                {selectedTab === "source-bal" && (
                  <div className="input-wrapper">
                    <AutocompleteInput
                      value={filter}
                      fetchResults={handleSearch}
                      onChange={(value) =>
                        handleFilter(value as DeploiementBALSearchResult | null)
                      }
                      placeholder="CC du Val d'Amboise ou Indre-et-Loire"
                    />
                  </div>
                )}
                <NavigationControl showZoom showCompass position="top-right" />
                <FullScreenControl
                  position="top-right"
                  container={mapContainerRef as React.RefObject<HTMLElement>}
                />

                {selectedTab !== "suivi-ban" && (
                  <>
                    <Source
                      promoteId="code"
                      id="data"
                      type="vector"
                      tiles={[
                        getSuiviBanTilesTemplateUrl().startsWith("/api")
                          ? `${origin}${getSuiviBanTilesTemplateUrl()}`
                          : getSuiviBanTilesTemplateUrl(),
                      ]}
                    >
                      <Layer
                        id="bal-polygon-fill"
                        type="fill"
                        source="data"
                        source-layer="communes"
                        paint={{
                          "fill-color": getStyle(
                            "source-bal",
                            filteredCodesCommmune,
                          ),
                          "fill-opacity": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            0.8,
                            0.6,
                          ],
                        }}
                        filter={["==", "$type", "Polygon"]}
                      />
                    </Source>
                    <DeploiementMap
                      center={geometry.center}
                      zoom={geometry.zoom}
                      filteredCodesCommmune={filteredCodesCommmune}
                      selectedPaintLayer="source-bal"
                      handleTerritorySelect={handleTerritorySelect}
                    />
                  </>
                )}

                {selectedTab === "suivi-ban" && (
                  <SuiviBanMapLayers suivi={suivi} />
                )}
              </Map>

              {selectedTab === "suivi-ban" && (
                <SuiviBanOverlay suivi={suivi} filter={filter} />
              )}
            </div>

            {selectedTab === "source-bal" && (
              <TabDeploiementBAL
                stats={stats}
                formatedStats={formatedStats}
                filter={filter}
                filteredCodesCommmune={filteredCodesCommmune}
              />
            )}
          </Tabs>
        </div>
      </div>
    </StyledDeploiementBALDashboard>
  );
}
