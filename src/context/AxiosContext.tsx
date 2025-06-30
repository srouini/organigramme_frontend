import React, { createContext, useContext, useMemo } from 'react'
import axios, { AxiosInstance } from 'axios'
import { API_ENDPOINT } from '@/utils/constants'
import { getCsrfToken } from '@/utils/csrf'

/* ---------- context ---------- */
const AxiosCtx = createContext<AxiosInstance | null>(null)

export const AxiosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /* one singleton per page-life-cycle */
  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: API_ENDPOINT,
      withCredentials: true,
    })

    /* ---- request interceptor: CSRF + JWT ---- */
    instance.interceptors.request.use(cfg => {
      cfg.headers['X-CSRFToken'] = getCsrfToken()            // Django’s csrftoken cookie
      const token = localStorage.getItem('access')           // or wherever you keep JWT
      if (token) cfg.headers.Authorization = `Bearer ${token}`
      return cfg
    })

    /* ---- response interceptor: 401 → silent refresh ----
       (only if you use JWT refresh tokens; omit otherwise)  */
    instance.interceptors.response.use(
      res => res,
      async err => {
        const { response } = err
        if (response?.status === 401 && localStorage.getItem('refresh')) {
          try {
            const { data } = await instance.post('/auth/refresh/', {
              refresh: localStorage.getItem('refresh'),
            })
            localStorage.setItem('access', data.access)
            err.config.headers.Authorization = `Bearer ${data.access}`
            return instance.request(err.config)              // retry original call
          } catch (_refreshErr) {
            // hard logout on refresh failure
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            window.location.href = '/login'
          }
        }
        return Promise.reject(err)
      },
    )

    return instance
  }, [])

  return <AxiosCtx.Provider value={client}>{children}</AxiosCtx.Provider>
}

/* Hook you can import anywhere */
export const useAxios = () => {
  const ctx = useContext(AxiosCtx)
  if (!ctx) throw new Error('useAxios must be used inside <AxiosProvider>')
  return ctx
}
