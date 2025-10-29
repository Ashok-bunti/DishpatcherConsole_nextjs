'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index'
import { useUpdateTowReport, useAIDashboard } from '../../../../../services/towReportService'
import { updateProcessedByByPO, setProcessedBy } from '../../../../../store/slices/driverLocationSlice'
import { showSnackbar } from '../../../../../store/slices/uiSlice'
import {
  Button,
  Box
} from "@mui/material"
import LoginIcon from '@mui/icons-material/Login'
import AppLoader from '../../../../../@crema/components/AppLoader/index'

const AcceptButton = ({
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
  const { processedBy, semiAutoAiConfig } = useAppSelector((state) => state.driverLocation)
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { mutate: updateReport } = useUpdateTowReport()
  const { refetch: refreshDashboard } = useAIDashboard({
    account: selectedReport?.account || "AJS",
    skip: 0,
    top: 100,
  })

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

  const handleAccept = async () => {
    if (!selectedReport?.id) return

    setIsProcessing(true)
    
    try {
      const payload = {
        processed_by: user.id,
        action: "accept"
      }

      updateReport(
        { id: selectedReport.id, payload },
        {
          onSuccess: (response) => {
            const callData = response.value?.[0] || response
            
            dispatch(setProcessedBy(callData?.processed_by))
            dispatch(updateProcessedByByPO({
              po: selectedReport.po,
              processedBy: callData?.processed_by
            }))

            // Refresh dashboard data
            refreshDashboard()

            dispatch(showSnackbar({
              message: 'Job accepted successfully',
              severity: 'success'
            }))

            onSuccess?.()
          },
          onError: (error) => {
            dispatch(showSnackbar({
              message: 'Error accepting job',
              severity: 'error'
            }))
          },
          onSettled: () => {
            setIsProcessing(false)
          }
        }
      )

    } catch (error) {
      console.error("Error accepting job:", error)
      dispatch(showSnackbar({
        message: 'Error accepting job',
        severity: 'error'
      }))
      setIsProcessing(false)
    }
  }

  // Don't render if phone is invalid or semiAutoAiConfig is not enabled
  if (formattedPhone === "Invalid Number" || !semiAutoAiConfig) {
    return null
  }

  // If already processed by current user
  if (processedBy?.email === loginuser) {
    return (
      <Button
        variant="contained"
        color="info"
        disabled
        startIcon={
          <LoginIcon
            sx={{
              color: "#1B2064",
              fontSize: 12,
              mt: "1px",
            }}
          />
        }
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: 'auto',
          backgroundColor: "#D9D9D9",
          color: "#1B2064",
          fontWeight: 600,
          '&.Mui-disabled': {
            backgroundColor: "#D9D9D9",
            color: "#1B2064",
          }
        }}
      >
        {processedBy?.name ? processedBy.name.substring(0, 5) : "Accepted"}
      </Button>
    )
  }

  // If processed by someone else
  if (processedBy?.email) {
    return (
      <Button
        variant="contained"
        color="info"
        disabled
        startIcon={
          <LoginIcon
            sx={{
              color: "#fff",
              fontSize: 14,
              mt: "1px",
            }}
          />
        }
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: 'auto',
          backgroundColor: "#B0B0B0",
        }}
      >
        {processedBy.name?.substring(0, 5) || "Taken"}
      </Button>
    )
  }

  // Main accept button
  return (
    <Button
      variant="contained"
      color="info"
      onClick={handleAccept}
      disabled={isProcessing || disabled}
      startIcon={
        <LoginIcon
          sx={{
            color: "#1B2064",
            fontSize: 14,
            mt: "1px",
          }}
        />
      }
      sx={{
        fontSize: '0.7rem',
        boxShadow: "none",
        px: 1.5,
        py: 0.6,
        width: '70px',
        height: '28px',
        backgroundColor: "#E3F2FD",
        color: "#1B2064",
        "&:hover": {
          backgroundColor: "#BBDEFB",
        }
      }}
      {...rest}
    >
      {isProcessing ? (
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
        "Accept"
      )}
    </Button>
  )
}

export default AcceptButton