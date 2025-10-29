'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index'
import { useUpdateTowReport, useAIDashboard } from '../../../../../services/towReportService'
import { setProcessedBy, updateProcessedByByPO } from '../../../../../store/slices/driverLocationSlice'
import { showSnackbar } from '../../../../../store/slices/uiSlice'
import { useTheme, Button, Box } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout'
import AppLoader from '../../../../../@crema/components/AppLoader/index'

const ReleaseButton = ({
  selectedReport,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onSuccess,
  ...rest
}) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { processedBy, easyCall, aiCallingEnabled } = useAppSelector((state) => state.driverLocation)
  const theme = useTheme()

  const [processing, setProcessing] = useState(false)

  const { mutate: updateReport } = useUpdateTowReport()
  const { refetch: refreshDashboard } = useAIDashboard({
    account: selectedReport?.account || "AJS",
    skip: 0,
    top: 100,
  })

  const isCxCalled = easyCall?.purchaseOrder ? false : true
  const loginuser = user?.email
  const customerContact = selectedReport?.customer_contact || ""
  const lastParenIndex = customerContact.lastIndexOf("(")
  let customerName = customerContact
  let customerPhone = ""

  if (lastParenIndex !== -1) {
    customerName = customerContact.slice(0, lastParenIndex).trim()
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
    if (!selectedReport?.id) return

    setProcessing(true)
    
    try {
      const payload = {
        action: "release",
        processed_by: null,
      }

      updateReport(
        { id: selectedReport.id, payload },
        {
          onSuccess: (response) => {
            dispatch(setProcessedBy({}))
            dispatch(updateProcessedByByPO({
              po: selectedReport.po,
              processedBy: {}
            }))

            // Refresh dashboard data
            refreshDashboard()

            dispatch(showSnackbar({
              message: 'Job released successfully',
              severity: 'success'
            }))

            onSuccess?.()
          },
          onError: (error) => {
            dispatch(showSnackbar({
              message: 'Error releasing job',
              severity: 'error'
            }))
          },
          onSettled: () => {
            setProcessing(false)
          }
        }
      )

    } catch (error) {
      console.error("Error releasing job:", error)
      dispatch(showSnackbar({
        message: 'Error releasing job',
        severity: 'error'
      }))
      setProcessing(false)
    }
  }

  // Only show if conditions are met
  if (!isCxCalled || formattedPhone === "Invalid Number" || processedBy?.email !== loginuser) {
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
        borderRadius: "25px",
        mr: 2,
        backgroundColor: "#1b2064",
        color: "#fff",
        '&:hover': { backgroundColor: "#141850" },
      }}
      {...rest}
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