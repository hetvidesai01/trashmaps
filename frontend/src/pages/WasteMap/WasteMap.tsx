import { PageContainer } from '../../components/layout/PageContainer'
import { MapView } from '../../components/map/MapView'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { PointStatusLegend } from '../../components/map/PointStatusLegend'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCollectionPoints } from '../../services/api'

export function WasteMap() {
  const { data: points } = useAsyncData(getCollectionPoints)

  return (
    <PageContainer className="max-w-full">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Waste map</h1>
        <p className="mt-1 text-sm text-muted">
          Every predefined and citizen-reported point, plotted by status.
        </p>
      </header>

      <div className="relative h-[calc(100svh-14rem)] min-h-[420px] overflow-hidden rounded-card border border-ink/10">
        <MapView>
          {points?.map((point) => (
            <CollectionPointMarker key={point.id} point={point} />
          ))}
        </MapView>
        <PointStatusLegend />
      </div>
    </PageContainer>
  )
}
