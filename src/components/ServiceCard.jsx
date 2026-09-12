import Card from './Card'

export default function ServiceCard({ service }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">
        {service.name}
      </h2>

      <p className="mt-2 text-2xl font-bold text-blue-600">
        ${service.price}
      </p>
    </Card>
  )
}