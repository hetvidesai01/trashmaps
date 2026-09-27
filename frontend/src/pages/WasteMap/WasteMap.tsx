import { MapContainer, TileLayer } from 'react-leaflet'
import { PageContainer } from '../../components/layout/PageContainer'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { PointStatusLegend } from '../../components/map/PointStatusLegend'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCollectionPoints } from '../../services/api'

const PUNE_CENTER: [number, number] = [18.56, 73.785]

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
        <MapContainer center={PUNE_CENTER} zoom={13} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points?.map((point) => (
            <CollectionPointMarker key={point.id} point={point} />
          ))}
        </MapContainer>
        <PointStatusLegend />
      </div>
    </PageContainer>
  )
}
