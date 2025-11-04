'use client'

import React, { useState } from 'react'
import { Button, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks/index'
import { setProcessedBy, setSelectedReport } from '../../../../../store/slices/driverLocationSlice'
import { useUpdateTowReport, useAIDashboard } from '../../../../../services/towReportService'
import { useQueryClient } from '@tanstack/react-query'
import AppLoader from '../../../../../@crema/components/AppLoader/index'
import { toast } from 'react-toastify'
import { useAuthUser } from '../../../../../@crema/hooks/AuthHooks'

const ReleaseButton = ({
  row,
  selectedReport: propSelectedReport,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onSuccess,
  sx,
  ...otherProps
}) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [processing, setProcessing] = useState(false)

  const reduxSelectedReport = useAppSelector((state) => state.driverLocation.selectedReport)
  const easyCall = useAppSelector((state) => state.driverLocation.easyCall)
  const { user: authUser } = useAuthUser()

  const currentReport = row || propSelectedReport || reduxSelectedReport
  const processedBy = currentReport?.processed_by

  const { mutateAsync: updateTowReport } = useUpdateTowReport()
  const { refetch: refetchAIDashboard } = useAIDashboard({
    account: currentReport?.account || 'QT-SD',
    skip: 0,
    top: 100,
  })

  const isCxCalled = easyCall?.purchaseOrder ? false : true

  const customerContact = currentReport?.customer_contact || ""
  const lastParenIndex = customerContact.lastIndexOf("(")
  let customerPhone = ""

  if (lastParenIndex !== -1) {
    customerPhone = customerContact.slice(lastParenIndex + 1).trim()
  }

  const cleanedPhone = customerPhone.replace(/\D/g, "")
  let formattedPhone = cleanedPhone
  if (cleanedPhone.length === 10) {
    formattedPhone = `+1 (${cleanedPhone.slice(0, 3)}) ${cleanedPhone.slice(3, 6)}-${cleanedPhone.slice(6)}`
  } else {
    formattedPhone = `Invalid Number`
  }

  const handleRelease = async () => {
    if (!currentReport?.id) {
      toast.error("No report selected")
      return
    }

    setProcessing(true)
    try {
      const payload = {
        action: "release",
        processed_by: null,
      }

      const response = await updateTowReport({
        id: currentReport.id,
        payload: payload
      })

      if (response?.data) {
        const updatedReport = response.data
        dispatch(setSelectedReport(updatedReport))
        dispatch(setProcessedBy(null))
        await refetchAIDashboard()
      } else if (response?.value?.[0]) {
        const updatedReport = response.value[0]
        dispatch(setSelectedReport(updatedReport))
        dispatch(setProcessedBy(null))
        await refetchAIDashboard()
      } else {
        dispatch(setProcessedBy(null))
        dispatch(setSelectedReport({
          ...currentReport,
          processed_by: null
        }))
      }

      if (onSuccess) {
        onSuccess()
      }

      await queryClient.invalidateQueries({ queryKey: ['aiDashboard'] })
      await queryClient.invalidateQueries({ queryKey: ['towReports'] })

      toast.success("Job released successfully")

    } catch (error) {
      toast.error(error?.message || "Failed to release job")
    } finally {
      setProcessing(false)
    }
  }

  const isAcceptedByCurrentUser = () => {
    if (!processedBy || !authUser) return false

    const userIdentifiers = [
      authUser?.email,
      authUser?.id,
      authUser?._id,
      authUser?.username
    ].filter(Boolean)

    const processedByIdentifiers = [
      processedBy?.email,
      processedBy?.id,
      processedBy?._id,
      processedBy?.username
    ].filter(Boolean)

    return userIdentifiers.some(userId => 
      processedByIdentifiers.some(processedId => 
        userId === processedId
      )
    )
  }

  const shouldShowButton = 
    isCxCalled &&
    formattedPhone !== "Invalid Number" &&
    isAcceptedByCurrentUser()

  if (!shouldShowButton) {
    return null
  }

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={
        !processing && (
          <LogoutIcon
            sx={{
              color: "#fff",
              fontSize: 14,
              mt: "1px",
            }}
          />
        )
      }
      onClick={handleRelease}
      disabled={processing || disabled}
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "0.7rem",
        px: 1.5,
        py: 0.6,
        width: '70px',
        height: '28px',
        mr: 2,
        backgroundColor: "#1b2064",
        color: "#fff",
        '&:hover': { 
          backgroundColor: "#141850" 
        },
        '&:disabled': {
          backgroundColor: "#9e9e9e",
          color: "#fff",
        },
        ...sx,
      }}
      {...otherProps}
    >
      {processing ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            transform: 'scale(0.5)'
          }}
        >
          <AppLoader />
        </Box>
      ) : (
        "Release"
      )}
    </Button>
  )
}

export default ReleaseButton