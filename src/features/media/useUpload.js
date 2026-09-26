import { useCallback } from 'react'

import { useSignUploadMutation } from './mediaApi'

/**
 * Upload browser File objects and resolve to the storage keys the rest of the
 * API speaks in (collaboration `file_refs`, media-kit items, avatars).
 *
 * Sign → PUT the bytes straight to the returned URL → keep the key. Files are
 * uploaded one at a time; a failure rejects with the message the service gave
 * (unsupported type, too large) so the caller can show it inline.
 */
export const useUpload = () => {
  const [signUpload, { isLoading }] = useSignUploadMutation()

  const upload = useCallback(
    async (files, { scope, refId = null } = {}) => {
      const keys = []
      for (const file of Array.from(files)) {
        if (!file.type) {
          throw new Error(`Can't tell what kind of file “${file.name}” is`)
        }
        const signed = await signUpload({
          scope,
          refId,
          contentType: file.type,
          sizeBytes: file.size
        }).unwrap()
        const res = await fetch(signed.upload_url, {
          method: signed.method,
          headers: signed.headers,
          body: file
        })
        if (!res.ok) throw new Error(`Upload failed for “${file.name}”`)
        keys.push(signed.key)
      }
      return keys
    },
    [signUpload]
  )

  return [upload, isLoading]
}
