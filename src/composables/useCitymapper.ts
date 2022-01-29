import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import { CMApi, EndpointsService } from '@/api/citymapper'

export async function useDirections(params: any) {
  const querystring = new URLSearchParams(params).toString()
  return await useFetch(`/citymapper/1/directions/transit?${querystring}`)
    .get()
    .json()
}
