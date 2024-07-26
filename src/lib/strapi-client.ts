import Strapi from 'strapi-sdk-js'

interface StrapiCollectionType {
  attributes: any
}

export const strapiClient = new Strapi({
  url: process.env.STRAPI_URL,
  axiosOptions: {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  },
})

export const getPage = async (id: string) => {
  const response = await strapiClient.find<StrapiCollectionType>(id, {
    populate: '*',
  })

  return response.data.attributes
}

export const getImageSrc = (imageData: { data: { attributes: { url: string } } }) => {
  return `${process.env.STRAPI_URL}${imageData.data.attributes.url}`
}
