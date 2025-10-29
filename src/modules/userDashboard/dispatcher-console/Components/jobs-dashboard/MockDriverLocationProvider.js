'use client'

import React from "react"
import { DriverLocationContext } from "../../Contexts/DriverLocationContext"

const MockDriverLocationProvider = ({ children, row }) => {
    const mockContextValue = {
        selectedReport: row,
        processedBy: row?.processed_by || null,
        easyCall: row?.easy_tow || null,
        seteasyCall: () => {},
        aiCallingEnabled: true,
        flatBedAvailability: true,
        wheelLiftTowTruckAvailability: true,
        semiAutoAiConfig: true,
        eta: 60,
        selectedEta: 60,
        setSelectedReport: () => { },
        setProcessedBy: () => { },
        updateProcessedByByPO: () => { },
    }

    return (
        <DriverLocationContext.Provider value={mockContextValue}>
            {children}
        </DriverLocationContext.Provider>
    )
}

export default MockDriverLocationProvider