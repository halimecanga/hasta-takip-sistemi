import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/price-detail/EmptyState'
import PriceDetailHeader from '../components/price-detail/PriceDetailHeader'
import PriceEditForm from '../components/price-detail/PriceEditForm'
import PriceInfoCards from '../components/price-detail/PriceInfoCards'
import PriceSummaryCard from '../components/price-detail/PriceSummaryCard'
import { pricesApi } from '../services/api'
import { paddedCardClass } from '../styles/uiClasses'

export default function PriceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [priceState, setPriceState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const editMode = searchParams.get('duzenle') === 'true'

  useEffect(() => {
    pricesApi.detail(id)
      .then(setPriceState)
      .catch((requestError) => {
        setError(requestError.message)
        setPriceState(null)
      })
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Fiyat kaydı yükleniyor...</section>
  if (error || !priceState) return <EmptyState />

  const closeEditMode = () => {
    navigate(`/fiyat-listesi/${priceState.id}`, { replace: true })
  }

  const savePrice = async (nextPrice) => {
    const saved = await pricesApi.update(priceState.id, nextPrice)
    setPriceState(saved)
    navigate(`/fiyat-listesi/${saved.id}`, { replace: true })
  }

  return (
    <>
      <PriceDetailHeader editMode={editMode} price={priceState} />
      {editMode ? (
        <PriceEditForm price={priceState} onCancel={closeEditMode} onSave={savePrice} />
      ) : (
        <>
          <PriceSummaryCard price={priceState} />
          <PriceInfoCards price={priceState} />
        </>
      )}
    </>
  )
}
