'use client'

import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index'
import { useMakeAICall, useAIDashboard } from '../../../../../services/towReportService'
import { setEasyCall } from '../../../../../store/slices/driverLocationSlice'
import { showSnackbar } from '../../../../../store/slices/uiSlice'
import { useTheme, Button, CircularProgress, Snackbar, Alert } from "@mui/material"
import { Call as CallIcon } from '@mui/icons-material'
import { useAuthUser } from '../../../../../@crema/hooks/AuthHooks'

const AICallButton = ({
  row,
  selectedReport: propSelectedReport,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onSuccess,
  sx,
  ...rest
}) => {
  const dispatch = useAppDispatch()
  const { user: authUser } = useAuthUser()
  const reduxSelectedReport = useAppSelector((state) => state.driverLocation.selectedReport)
  const {
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

  const currentReport = row || propSelectedReport || reduxSelectedReport
  const processedBy = currentReport?.processed_by

  const { mutate: makeAICall } = useMakeAICall()
  const { refetch: refreshDashboard } = useAIDashboard({
    account: currentReport?.account || "AJS",
    skip: 0,
    top: 100,
  })

  const currentPO = currentReport?.po || ''

  const extractVehicleInfo = (fullVehicleString) => {
    if (!fullVehicleString) return ""
    const words = fullVehicleString.split(' ')
    return words.slice(0, Math.min(4, words.length)).join(' ')
  }

  const isPOCalled = calledPOs[currentPO] || (easyCall && easyCall.purchaseOrder === currentPO)
  const isCxCompleted = easyCall && easyCall.responseText && easyCall.purchaseOrder === currentPO

  const customerContact = currentReport?.customer_contact || ""
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
        purchaseOrder: currentReport.po || "N/A",
        company: currentReport.job_type === "live_data" ? currentReport.account : currentReport.account,
        dispatcher: authUser.displayName || "N/A",
        customerName: customerName || "N/A",
        customerPhone: formattedPhone || "N/A",
        notes: currentReport.notes || "N/A",
        account: currentReport.job_type === "live_data" ? currentReport.account_type : "Demo",
        drivernotes: currentReport.driver_notes || "N/A",
        vehicleModel: extractVehicleInfo(currentReport?.vehicle),
        serviceCategory: "RoadSideService",
        reason: currentReport.reason || "N/A",
        towSource: currentReport.source || "N/A",
        towDestination: currentReport.destination || "N/A",
        flatBedTowTruckAvailable: flatBedAvailability,
        wheelLiftTowTruckAvailable: wheelLiftTowTruckAvailability,
        jobEta: selectedEta,
        customerNeedsRide: "N/A",
        serviceType: currentReport.driver_notes || "N/A",
        towReportId: currentReport.id,
      }

      makeAICall(body, {
        onSuccess: (response) => {
          dispatch(setEasyCall(response.easyCall))
          
          setCalledPOs(prev => {
            const updated = { ...prev, [currentPO]: true }
            localStorage.setItem('cxcalled_pos', JSON.stringify(updated))
            return updated
          })

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
  const shouldShowButton = 
    isAcceptedByCurrentUser() &&
    !isPOCalled &&
    formattedPhone !== "Invalid Number"

  if (shouldShowButton) {
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
          ...sx,
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

  if (isPOCalled && !isCxCompleted) {
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
          ...sx,
        }}
      >
        Cx Called
      </Button>
    )
  }

  return null
}

export default AICallButton