
export const sectionItems = [
    {
        id: 1,
        label: 'All Jobs',
        filterType: 'all',
        color: '#4a5568'
    },
    {
        id: 2,
        label: 'AI Calls',
        filterType: 'ai',
        color: '#9B1FE9'
    },
    {
        id: 3,
        label: 'Non-AI Calls',
        filterType: 'non-ai',
        color: '#1664C0'
    },
    {
        id: 4,
        label: 'Completed',
        filterType: 'completed',
        color: '#38a169'
    },
    {
        id: 5,
        label: 'Demo Jobs',
        filterType: 'demo',
        color: '#dd6b20'
    },
    {
        id: 6,
        label: 'My Jobs',
        filterType: 'my-jobs',
        color: '#e53e3e'
    }
]

export const filterCallsByStatus = (calls, status, loggedInUserId, selectedAccount = 'all') => {
    if (!Array.isArray(calls)) return []

    const filteredByAccount = selectedAccount === 'all' 
        ? calls 
        : calls.filter(call => call.account === selectedAccount)

    switch (status) {
        case 'ai':
            return filteredByAccount.filter(call =>
                call?.account === selectedAccount &&
                call?.ai_call_disabled === false &&
                call?.tx_job_status !== "completed" &&
                call?.cx_call !== "ai_call_failed" &&
                call?.easy_tow?.responseText?.CallScoreReview !== "Negative" &&
                call?.easy_tow?.responseText?.CallScoreReview !== "Neutral"
            )

        case 'non-ai':
            return filteredByAccount.filter(call =>
                (call?.ai_call_disabled === true && call?.tx_job_status !== "completed") ||
                (call?.escalated === true &&
                    call?.tx_job_status !== "completed" &&
                    ["ai_call_failed", "ended"].includes(call?.cx_call) &&
                    (call?.easy_tow?.responseText?.CallScoreReview === "Negative" ||
                        call?.easy_tow?.responseText?.CallScoreReview === "Neutral"))
            )

        case 'completed':
            return filteredByAccount.filter(call => call?.tx_job_status === "completed")

        case 'demo':
            return filteredByAccount.filter(call =>
                call?.po?.startsWith("PO-") &&
                call?.tx_job_status !== "completed"
            )

        case 'my-jobs':
            return filteredByAccount.filter(call =>
                call?.processed_by?._id === loggedInUserId &&
                (call?.tx_job_status !== "completed" || call?.tx_job_status === "completed")
            )

        case 'all':
        default:
            return filteredByAccount.filter(call => call?.tx_job_status !== "completed")
    }
}

export const categorizeData = (dataArray, selectedAccount, loggedInUserId) => {
    if (!Array.isArray(dataArray)) return {
        ai: [],
        'non-ai': [],
        completed: [],
        demo: [],
        'my-jobs': []
    }

    return {
        ai: dataArray.filter(item =>
            item?.account === selectedAccount &&
            item?.ai_call_disabled === false &&
            item?.tx_job_status !== "completed" &&
            item?.cx_call !== "ai_call_failed" &&
            item?.easy_tow?.responseText?.CallScoreReview !== "Negative" &&
            item?.easy_tow?.responseText?.CallScoreReview !== "Neutral"
        ),

        'non-ai': dataArray.filter(item =>
            (item?.ai_call_disabled === true && item?.tx_job_status !== "completed") ||
            (item?.escalated === true &&
                item?.tx_job_status !== "completed" &&
                ["ai_call_failed", "ended"].includes(item?.cx_call) &&
                (item?.easy_tow?.responseText?.CallScoreReview === "Negative" ||
                    item?.easy_tow?.responseText?.CallScoreReview === "Neutral"))
        ),

        completed: dataArray.filter(item => item?.tx_job_status === "completed"),

        demo: dataArray.filter(item =>
            item?.po?.startsWith("PO-") &&
            item?.tx_job_status !== "completed"
        ),

        'my-jobs': dataArray.filter(item =>
            item?.processed_by?._id === loggedInUserId &&
            (item?.tx_job_status !== "completed" || item?.tx_job_status === "completed")
        )
    }
}

export const getTabCounts = (categorizedData) => ({
    all: (categorizedData.ai?.length || 0) + (categorizedData['non-ai']?.length || 0),
    ai: categorizedData.ai?.length || 0,
    "non-ai": categorizedData['non-ai']?.length || 0,
    completed: categorizedData.completed?.length || 0,
    demo: categorizedData.demo?.length || 0,
    "my-jobs": categorizedData['my-jobs']?.length || 0,
})