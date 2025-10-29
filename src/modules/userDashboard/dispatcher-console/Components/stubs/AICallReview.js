'use client'

import React, { useState } from "react"
import { useAppSelector } from '../../../../../store/hooks/index'
import {
  useTheme, Button
} from "@mui/material"
import DiffDialog from "./DiffDialog"

const AICallReview = ({
  selectedReport,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  ...rest
}) => {
  const { easyCall } = useAppSelector((state) => state.driverLocation)
  const theme = useTheme()

  const [diffDialogOpen, setDiffDialogOpen] = useState(false)
  const [diffData, setDiffData] = useState(null)

  const isCxCompleted = easyCall?.responseText?.Purchase_Order ? true : false
  const callScoreReview = easyCall?.responseText?.CallScoreReview

  const colMap = {
    purchaseOrder: "Purchase_Order",
    customerName: "customerName",
    makeModelFormatted: "Make_Model_Formatted",
    "reason": 'Reason',
    towSource: "Tow_Source",
    towDestination: "Tow_Destination",
    additionalInformation: "Additional_Info",
  }

  let diffCount = 0
  const diffList = []

  if (isCxCompleted) {
    const aiResponse = easyCall?.responseText

    if (aiResponse && typeof aiResponse === 'object' && !Array.isArray(aiResponse)) {
      const keys = Object.keys(colMap)

      keys.forEach(key => {
        const aiResponseKey = colMap[key]
        const aiValue = aiResponse[aiResponseKey]
        const originalValue = easyCall[key]
        const isDiff = aiValue !== originalValue

        if (isDiff) {
          diffList.push(key)
          diffCount++
        }
      })
    }
  }

  const handleCloseDiffDialog = () => {
    setDiffDialogOpen(false)
  }

  const handleDiffClick = async () => {
    try {
      setDiffData(easyCall)
      setDiffDialogOpen(true)
    } catch (error) {
      console.error("Error fetching diff data:", error)
    }
  }

  const cancelKeywords = ["cancel", "cancellation", "cancelled", "job cancelled", "job cancel"]

  const isJobCancelled = cancelKeywords.some(word =>
    selectedReport?.easy_tow?.responseText?.reason?.toLowerCase().includes(word)
  )

  const getButtonColor = () => {
    if (isJobCancelled) {
      return "#ff4444"
    } else if (callScoreReview === 'Positive') {
      return "#2E7D32"
    } else if (callScoreReview === 'Neutral') {
      return "#FF9800"
    } else if (callScoreReview === 'Negative') {
      return "#ff4444"
    } else {
      return "#ff4444"
    }
  }

  const getHoverColor = () => {
    if (isJobCancelled) {
      return "#cc0000"
    } else if (callScoreReview === 'Positive') {
      return "#1B5E20"
    } else if (callScoreReview === 'Neutral') {
      return "#F57C00"
    } else if (diffCount > 0) {
      return "#cc0000"
    } else {
      return "#1B5E20"
    }
  }

  return (
    <>
      {diffData && (
        <DiffDialog
          open={diffDialogOpen}
          onClose={handleCloseDiffDialog}
          obj1={Object.assign({}, diffData) || {}}
        />
      )}

      {isCxCompleted && (
        <Button
          variant="contained"
          onClick={handleDiffClick}
          disabled={disabled}
          sx={{
            fontSize: '0.7rem',
            px: 1.5,
            py: 0.6,
            minWidth: '70px',
            height: '28px',
            backgroundColor: getButtonColor(),
            color: "#fff",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: getHoverColor(),
            }
          }}
          {...rest}
        >
          Review
        </Button>
      )}
    </>
  )
}

export default AICallReview