interface PanoramaxControlsProps {
    mode: 'viewer-main' | 'map-main'
    onToggleMode: () => void
    onClose: () => void
}

export function PanoramaxControls({ mode, onToggleMode, onClose }: PanoramaxControlsProps) {
    
    const label = mode === 'viewer-main' ? 'Agrandir la carte' : 'Agrandir la photo'

    return (
        <div
            style={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 30,
                display: 'flex',
                gap: 8,
            }}
        >
            <button
                type="button"
                onClick={onToggleMode}
                title={label}
                aria-label={label}
                className="fr-btn fr-btn--sm fr-btn--secondary fr-icon-arrow-left-right-line"
            />
            <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la vue Panoramax"
                className="fr-btn fr-btn--sm fr-btn--secondary fr-icon-close-line"
            />
        </div>
    )
}