import { useFetch } from '@vueuse/core'
import { ref } from 'vue'

// https://docs.mainland-eks-staging.citymapper.com/doc/externalapi/docs/welcome.html
// https://docs-staging.external.citymapper.com/api/

export async function useDirections(params: any) {
  const querystring = new URLSearchParams(params).toString()
  return await useFetch(`/citymapper/1/directions/transit?${querystring}`)
    .get()
    .json()
}
