// src/hooks/useAxios.ts
import { useMemo } from 'react'
import axios from 'axios'
import { API_ENDPOINT } from '@/utils/constants'
import { getCsrfToken } from '@/utils/csrf'

export const useAxios = () =>
  useMemo(() => {
    const instance = axios.create({ baseURL: API_ENDPOINT, withCredentials: true })
    instance.defaults.headers['X-CSRFToken'] = getCsrfToken()
    return instance
  }, [])
