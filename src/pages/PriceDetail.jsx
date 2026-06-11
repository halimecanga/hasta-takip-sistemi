import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/price-detail/EmptyState'
import PriceDetailHeader from '../components/price-detail/PriceDetailHeader'
import PriceEditForm from '../components/price-detail/PriceEditForm'
import PriceInfoCards from '../components/price-detail/PriceInfoCards'
import PriceSummaryCard from '../components/price-detail/PriceSummaryCard'
import { priceList } from '../data/mockData'

export default function PriceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const priceRecord = priceList.find((price) => price.id === id)
  const [priceState, setPriceState] = useState(priceRecord)
  const editMode = searchParams.get('duzenle') === 'true'

  useEffect(() => {
    setPriceState(priceRecord)
  }, [priceRecord])

  if (!priceRecord || !priceState) return <EmptyState />

  const closeEditMode = () => {
    navigate(`/fiyat-listesi/${priceState.id}`, { replace: true })
  }

  const savePrice = (nextPrice) => {
    setPriceState(nextPrice)
    navigate(`/fiyat-listesi/${nextPrice.id}`, { replace: true })
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
