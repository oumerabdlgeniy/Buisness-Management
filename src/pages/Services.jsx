import PageTitle from '../components/PageTitle'
import ServiceCard from '../components/ServiceCard'
import { services } from '../data/data'

export default function Services() {
  return (
    <div className="p-6">

      <PageTitle
        title="Services"
        description="Manage the services your business provides."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}

      </div>

    </div>
  )
}