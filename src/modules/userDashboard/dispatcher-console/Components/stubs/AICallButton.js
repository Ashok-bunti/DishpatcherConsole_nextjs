'use client'

import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index'
import { useMakeAICall, useAIDashboard } from '../../../../../services/towReportService'
import { setEasyCall } from '../../../../../store/slices/driverLocationSlice'
import { showSnackbar } from '../../../../../store/slices/uiSlice'
import { useTheme, Button, CircularProgress, Snackbar, Alert } from "@mui/material"
import { Call as CallIcon } from '@mui/icons-material'

const AICallButton = ({
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
  const {
    processedBy,
    easyCall,
    aiCallingEnabled,
    flatBedAvailability,
    wheelLiftTowTruckAvailability,
    semiAutoAiConfig,
    selectedEta,
  } = useAppSelector((state) => state.driverLocation)

  const [processing, setProcessing] = useState(false)
  const [calledPOs, setCalledPOs] = useState({})
  const [isInitialized, setIsInitialized] = useState(false)

  const { mutate: makeAICall } = useMakeAICall()
  const { refetch: refreshDashboard } = useAIDashboard({
    account: selectedReport?.account || "AJS",
    skip: 0,
    top: 100,
  })

  const currentPO = selectedReport?.po || ''
  const email = user?.email

  const extractVehicleInfo = (fullVehicleString) => {
    if (!fullVehicleString) return ""
    const words = fullVehicleString.split(' ')
    return words.slice(0, Math.min(4, words.length)).join(' ')
  }

  const isPOCalled = calledPOs[currentPO] || (easyCall && easyCall.purchaseOrder === currentPO)
  const isProcessed = processedBy && processedBy.email === email
  const isCxCalled = isPOCalled
  const isCxCompleted = easyCall && easyCall.responseText && easyCall.purchaseOrder === currentPO

  const customerContact = selectedReport?.customer_contact || ""
  const lastParenIndex = customerContact?.lastIndexOf("(")
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

  useEffect(() => {
    try {
      const savedCalledPOs = localStorage.getItem('cxcalled_pos')
      if (savedCalledPOs) {
        setCalledPOs(JSON.parse(savedCalledPOs))
      }
    } catch (error) {
      console.error("Error loading called POs from localStorage:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    if (easyCall && easyCall.purchaseOrder === currentPO && !calledPOs[currentPO]) {
      setCalledPOs(prev => {
        const updated = { ...prev, [currentPO]: true }
        localStorage.setItem('cxcalled_pos', JSON.stringify(updated))
        return updated
      })
    }
  }, [easyCall, currentPO, calledPOs, isInitialized])

  const handleCxCall = async () => {
    if (!currentPO) {
      dispatch(showSnackbar({
        message: "No PO number available for this report",
        severity: "error"
      }))
      return
    }

    setProcessing(true)
    
    try {
      const body = {
        purchaseOrder: selectedReport.po || "N/A",
        company: selectedReport.job_type === "live_data" ? selectedReport.account : selectedReport.account,
        dispatcher: user.displayName || "N/A",
        customerName: customerName || "N/A",
        customerPhone: formattedPhone || "N/A",
        notes: selectedReport.notes || "N/A",
        account: selectedReport.job_type === "live_data" ? selectedReport.account_type : "Demo",
        drivernotes: selectedReport.driver_notes || "N/A",
        vehicleModel: extractVehicleInfo(selectedReport?.vehicle),
        serviceCategory: "RoadSideService",
        reason: selectedReport.reason || "N/A",
        towSource: selectedReport.source || "N/A",
        towDestination: selectedReport.destination || "N/A",
        flatBedTowTruckAvailable: flatBedAvailability,
        wheelLiftTowTruckAvailable: wheelLiftTowTruckAvailability,
        jobEta: selectedEta,
        customerNeedsRide: "N/A",
        serviceType: selectedReport.driver_notes || "N/A",
        towReportId: selectedReport.id,
      }

      makeAICall(body, {
        onSuccess: (response) => {
          dispatch(setEasyCall(response.easyCall))
          
          // Update called POs
          setCalledPOs(prev => {
            const updated = { ...prev, [currentPO]: true }
            localStorage.setItem('cxcalled_pos', JSON.stringify(updated))
            return updated
          })

          // Refresh dashboard
          refreshDashboard()

          dispatch(showSnackbar({
            message: "Tow request sent successfully",
            severity: "success"
          }))

          onSuccess?.()
        },
        onError: (error) => {
          dispatch(showSnackbar({
            message: `Error while calling API: ${error.message || error}`,
            severity: "error"
          }))
        },
        onSettled: () => {
          setProcessing(false)
        }
      })

    } catch (error) {
      dispatch(showSnackbar({
        message: `Error while calling API: ${error.message || error}`,
        severity: "error"
      }))
      setProcessing(false)
    }
  }

  if (!isInitialized) return null

  // Show AI Call button only if processed by current user and not called yet
  if (isProcessed && !isCxCalled && semiAutoAiConfig) {
    return (
      <Button
        variant="contained"
        onClick={handleCxCall}
        disabled={processing || disabled}
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: '70px',
          height: '28px',
          boxShadow: 'none',
          backgroundColor: "#2E7D32",
          color: '#fff',
          '&:hover': { backgroundColor: "#256628" },
        }}
        startIcon={
          !processing && (
            <CallIcon
              sx={{
                color: "#fff",
                fontSize: 14,
                mt: "1px",
              }}
            />
          )
        }
        {...rest}
      >
        {processing ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Call"
        )}
      </Button>
    )
  }

  // Show disabled button if called but not completed
  if (isCxCalled && !isCxCompleted) {
    return (
      <Button
        variant="contained"
        disabled
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: '70px',
          height: '28px',
          backgroundColor: "#DCDCDC",
        }}
      >
        Cx Called
      </Button>
    )
  }

  return null
}

export default AICallButton