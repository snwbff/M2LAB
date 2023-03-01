import axios from 'axios'

export async function fetchData(url) {
  let price
  let rooms
  let realEstateTypes

  await axios.get(url).then((response) => {
    price = response.data[0].price
    rooms = response.data[0].rooms
    realEstateTypes = response.data[0].realEstateTypes
  })

  return { price, rooms, realEstateTypes }
}
