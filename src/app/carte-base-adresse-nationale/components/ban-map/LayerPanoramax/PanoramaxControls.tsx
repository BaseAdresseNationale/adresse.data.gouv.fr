interface PanoramaxControlsProps {
    mode: 'viewer-main' | 'map-main'
    isReduced?: boolean
    onToggleMode: () => void
    onClose: () => void
    onToggleReduce?: () => void
}

export function PanoramaxControls({ mode, isReduced = false, onToggleMode, onClose, onToggleReduce }: PanoramaxControlsProps) {
    
    const labelChoose = mode === 'viewer-main' ? 'Agrandir la carte' : 'Agrandir la photo'
    const labelWindows = isReduced ? 'Agrandir la fenêtre' : 'Réduire la fenêtre'

    return (
        <div
            style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 30,
                display: 'flex',
                gap: 8,
            }}
        >
            <button
                type="button"
                onClick={onToggleMode}
                title={labelChoose}
                aria-label={labelChoose}
                className="fr-btn fr-btn--sm fr-btn--secondary fr-icon-arrow-left-right-line"
            />
            <button
                type="button"
                onClick={onToggleReduce}
                title={labelWindows}
                aria-label={labelWindows}
                className={`fr-btn fr-btn--sm fr-btn--secondary ${isReduced ? 'fr-icon-expand-left-right-line' : 'fr-icon-contract-left-right-line'}`}
            />
            <button
                type="button"
                onClick={onClose}
                title="Fermer la vue Panoramax"
                aria-label="Fermer la vue Panoramax"
                className="fr-btn fr-btn--sm fr-btn--secondary fr-icon-close-line"
            />
        </div>
    )
}