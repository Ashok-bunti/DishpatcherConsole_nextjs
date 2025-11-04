'use client'

import React from "react"
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index'
import { setSelectedReport, setProcessedBy, setSemiAutoAiConfig } from '../../../../../store/slices/driverLocationSlice'

const MockDriverLocationProvider = ({ children, row }) => {
    const dispatch = useAppDispatch()
    const currentSelectedReport = useAppSelector((state) => state.driverLocation.selectedReport)

    React.useEffect(() => {
        if (row) {
            if (!currentSelectedReport || currentSelectedReport.id !== row.id) {
                dispatch(setSelectedReport(row))
                dispatch(setProcessedBy(row?.processed_by || null))
                dispatch(setSemiAutoAiConfig(true))
            } else if (currentSelectedReport.id === row.id) {
                const currentProcessedBy = currentSelectedReport.processed_by
                const newProcessedBy = row.processed_by

                if (JSON.stringify(currentProcessedBy) !== JSON.stringify(newProcessedBy)) {
                    dispatch(setProcessedBy(newProcessedBy || null))
                    console.log('MockProvider: Updated processed_by:', newProcessedBy)
                }
            }
        }
    }, [row?.id, row?.processed_by, dispatch])

    return children
}

export default MockDriverLocationProvider