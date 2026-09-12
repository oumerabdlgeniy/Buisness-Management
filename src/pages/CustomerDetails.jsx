import { useParams } from 'react-router-dom'
import { customers } from '../data/data'

export default function CustomerDetails() {

  const { id } = useParams()

  const customer = customers.find(
    (customer) => customer.id === Number(id)
  )

  if (!customer) {
    return <p className="p-6">Customer not found.</p>
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-slate-900">
        {customer.name}
      </h1>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <p>
          <strong>Email:</strong> {customer.email}
        </p>

        <p className="mt-2">
          <strong>Phone:</strong> {customer.phone}
        </p>

      </div>

    </div>
  )
}