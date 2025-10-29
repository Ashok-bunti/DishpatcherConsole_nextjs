'use client'

import React, { useState } from "react"
import {
  Box, Typography, Grid, useMediaQuery, useTheme,
  IconButton, Tooltip, Button, Dialog, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Snackbar, Alert, Chip, Avatar,
  Divider, TextField
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import DescriptionIcon from '@mui/icons-material/Description'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import PersonIcon from '@mui/icons-material/Person'

const DiffDialog = ({ open, onClose, obj1 }) => {
  dayjs.extend(utc)
  
  const obj2 = obj1?.responseText ? obj1?.responseText : {}
  
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  function parseToObject(inputString) {
    const result = {}
    const pairs = inputString.split(';').map(pair => pair.trim()).filter(pair => pair !== '')

    pairs.forEach(pair => {
      const [key, ...valueParts] = pair.split('=')
      const keyTrimmed = key.trim()
      let value = valueParts.join('=').trim()

      if (value === 'true') {
        value = true
      } else if (value === 'false') {
        value = false
      } else if (value === '') {
        value = ''
      }

      result[keyTrimmed] = value
    })

    return result
  }

  let pData = obj2?.additionalInformation
  let format = pData?.replace(";", '\n') || ''

  const colMap = {
    purchaseOrder: "Purchase_Order",
    customerName: "CustomerName",
    makeModelFormatted: "Make_Model_Formatted",
    reason: 'Reason',
    phoneNumber: "outBoundCallNumber",
    towSource: "Tow Source",
    towDestination: "Tow Destination",
    call_notes: "call_notes",
    additionalInformation: "additionalInformation"
  }

  const fieldDisplayNames = {
    purchaseOrder: "Purchase Order",
    phoneNumber: " Phone Number",
    customerName: "Customer Name",
    makeModelFormatted: " Vehicle Details",
    reason: "Reason",
    additionalInformation: "Additional Information",
    call_notes: "Call Notes",
    towSource: "Tow Source",
    towDestination: "Tow Destination",
  }

  const fields = Object.keys(colMap)

  const handleTranscriptClick = () => {
    setTranscriptDialogOpen(true)
  }

  const handleCloseTranscriptDialog = () => {
    setTranscriptDialogOpen(false)
  }

  const transcript = obj1.transcript || ""

  function formatChatText(transcript) {
    if (!transcript) return ''

    const parts = transcript.split(/(Agent:|User:)/g)

    let result = []
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'Agent:' || parts[i] === 'User:') {
        if (i > 0) result.push('\n')
        result.push(
          <span key={i} style={{ fontWeight: 'bold' }}>
            {parts[i]}
          </span>
        )
      } else {
        result.push(parts[i])
      }
    }

    return result
  }

  const handleCopyText = async (text) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setSnackbarOpen(true)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        if (successful) {
          setSnackbarOpen(true)
        }
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  const reason = obj2.disconnectReason

  const parseAdditionalInfo = (infoString) => {
    if (!infoString) return {}

    const pairs = infoString.split(';').map(pair => pair.trim())
    const result = {}

    pairs.forEach(pair => {
      if (pair) {
        const [key, value] = pair.split('=').map(item => item.trim())
        if (key && value !== undefined) {
          result[key] = value
        }
      }
    })

    return result
  }

  const additionalInfo = parseAdditionalInfo(obj2?.additionalInformation)
  const isApproved = additionalInfo['Customer_Approved_Service'] === 'Yes'
  const serviceCharge = additionalInfo['Total Service Charge'] || '000'

  const cleanString = (str) => {
    if (!str) return ''
    return str
      .toString()
      .trim()
      .replace(/[\s\r\n]+/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\u200B/g, '')
      .replace(/\s*;?\s*$/, '')
      .toLowerCase()
  }

  const normalizeAdditionalInfo = (str) => {
    if (!str) return ''
    return str
      .split(';')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => item.replace(/\s+/g, ' '))
      .sort()
      .join(';').toLowerCase()
  }

  const highlightText = (text, term) => {
    if (!term) return text
    const parts = text.split(new RegExp(`(${term})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <Box
          key={i}
          component="span"
          sx={{
            backgroundColor: "#fff176",
            borderRadius: "2px",
            px: 0.3,
          }}
        >
          {part}
        </Box>
      ) : (
        part
      )
    )
  }

  const areFieldsEqual = (field, val1, val2) => {
    if (field === 'additionalInformation') {
      return normalizeAdditionalInfo(val1) === normalizeAdditionalInfo(val2)
    }
    return cleanString(val1) === cleanString(val2)
  }

  return (
    <>
      {/* Diff Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f8f8f8',
            padding: '20px 24px'
          }}>
            {/* Header content */}
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: 24
                  }}
                >
                  CX Call Review
                </Typography>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: 'grey.300' }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: obj1?.createdAt ? 'white' : 'red',
                    padding: '4px 8px',
                    color: obj1?.createdAt ? 'text.secondary' : 'error.main'
                  }}
                >
                  {obj1?.createdAt
                    ? dayjs.utc(obj1.createdAt).format('MM/DD/YYYY HH:mm')
                    : 'MM/DD/YYYY 00:00'}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Call Duration:
                <Box component="span" sx={{
                  color: '#d32f2f',
                  fontWeight: 600,
                  ml: 0.5
                }}>
                  {obj2?.callDurationMin || '0'}s
                </Box>
              </Typography>
            </Box>

            {/* Chips and buttons */}
            <Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 2,
                mb: 3
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                  {serviceCharge !== '000' &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Chip
                        label={isApproved ? 'Approved' : 'Not Approved'}
                        color={isApproved ? 'success' : 'error'}
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderWidth: 1.5,
                          width: '90px',
                          height: '28px',
                          '& .MuiChip-label': {
                            color: isApproved ? '#2e7d32' : '#d32f2f',
                            fontSize: '0.8rem',
                            width: '100%',
                            textAlign: 'center',
                            padding: '0px 6px'
                          }
                        }}
                      />
                      {serviceCharge !== '000' && <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          fontWeight: 600,
                          textAlign: 'center',
                          fontSize: '0.85rem',
                        }}
                      >
                        {serviceCharge}
                      </Typography>}
                    </Box>}
                  
                  {/* Other chips for sentiment, review, score */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Chip
                      label={obj2?.userSentiment || 'Neutral'}
                      color={
                        obj2?.userSentiment === 'Positive' ? 'success' :
                          obj2?.userSentiment === 'Negative' ? 'error' : 'warning'
                      }
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderWidth: 1.5,
                        width: '90px',
                        height: '28px',
                        '& .MuiChip-label': {
                          color: obj2?.userSentiment === 'Positive' ? '#2e7d32' :
                            obj2?.userSentiment === 'Negative' ? '#d32f2f' : '#ed6c02',
                          fontSize: '0.8rem',
                          width: '100%',
                          textAlign: 'center',
                          padding: '0px 6px'
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        textAlign: 'center',
                        fontSize: '0.85rem'
                      }}
                    >
                      Status
                    </Typography>
                  </Box>

                  {/* Add other chips similarly */}
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center'
                }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<DescriptionIcon />}
                    onClick={handleTranscriptClick}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      height: '28px'
                    }}
                  >
                    View Transcript
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Call Outcome */}
            <Box sx={{
              borderTop: '1px solid #e0e0e0',
              pt: 2,
              pb: 1,
              mt: 1,
              backgroundColor:
                obj2?.userSentiment === 'Positive' ? 'rgba(46, 125, 50, 0.1)' :
                  obj2?.userSentiment === 'Negative' ? 'rgba(211, 47, 47, 0.1)' :
                    'rgba(237, 108, 2, 0.1)',
              borderRadius: 1,
              px: 2
            }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color:
                    obj2?.userSentiment === 'Positive' ? '#2e7d32' :
                      obj2?.userSentiment === 'Negative' ? '#d32f2f' :
                        '#ed6c02'
                }}
              >
                Call Outcome:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  mt: 1,
                  color: '#333'
                }}
              >
                {obj1?.responseText?.CallOutcome}
                <IconButton
                  onClick={() => handleCopyText(obj1?.responseText?.CallOutcome)}
                  size="small"
                  sx={{
                    color: "#1B2064",
                    "&:hover": { backgroundColor: "rgba(27, 32, 100, 0.1)" },
                    ml: 1,
                  }}
                  aria-label="Copy to clipboard"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Typography>
            </Box>
          </Box>

          {/* Comparison Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600, width: '20%', borderBottom: '2px solid #e0e0e0' }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '40%', borderBottom: '2px solid #e0e0e0' }}>Current Job Details</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '40%', borderBottom: '2px solid #e0e0e0' }}>AI Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow
                    key={field}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#f0f7ff' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: '#555' }}>
                      {fieldDisplayNames[field] || field}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        backgroundColor: !obj1[field] ? '#eeeeee' : 'inherit',
                        color: !obj1[field] ? '#b0b0b0' : 'inherit',
                        fontStyle: !obj1[field] ? 'italic' : 'normal',
                      }}
                    >
                      {obj1[field] === 'N/A' ? '-' : obj1[field] || (field != 'additionalInformation' && obj2[colMap[field]])}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        backgroundColor: areFieldsEqual(field, obj1[field], obj2[colMap[field]])
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'rgba(244, 67, 54, 0.1)',
                        color: areFieldsEqual(field, obj1[field], obj2[colMap[field]]) ? '#2e7d32' : '#d32f2f',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      {field === 'additionalInformation' && obj2[colMap[field]]
                        ? obj2[colMap[field]]
                          .split(';')
                          .map(item => item.trim())
                          .filter(item => {
                            const [_, value] = item.split('=')
                            return value && value.trim() !== ''
                          })
                          .map((item, index) => (
                            <p key={index} style={{ margin: 0 }}>{item}</p>
                          ))
                        : (obj2[colMap[field]] === 'N/A' ? "-" : obj2[colMap[field]]) || "-"}

                      {(field === 'call_notes' || field === 'additionalInformation') && obj2[colMap[field]] && (
                        <IconButton
                          onClick={() => handleCopyText(obj2[colMap[field]] || '')}
                          size="small"
                          sx={{
                            color: "#1B2064",
                            "&:hover": { backgroundColor: "rgba(27, 32, 100, 0.1)" },
                            ml: 1,
                          }}
                          aria-label="Copy to clipboard"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Button
            onClick={onClose}
            color="error"
            variant="outlined"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transcript Dialog */}
      <Dialog
        open={transcriptDialogOpen}
        onClose={handleCloseTranscriptDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            width: "35%",
          },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          {/* Transcript header with search */}
          <Box
            sx={{
              background: "#f0f4f8",
              padding: "16px 24px",
              position: "relative",
              borderBottom: "1px solid #e0e6ed",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#2c3e50",
                letterSpacing: "0.2px",
                fontFamily: "Georgia, Times, serif",
                fontSize: 18,
              }}
            >
              Call Transcript
            </Typography>

            <TextField
              size="small"
              placeholder="Search in transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: "45%",
                borderRadius: 50,
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Georgia, Times, serif",
                  backgroundColor: "#ffffff",
                  fontSize: 14,
                  "& fieldset": { borderColor: "#c3d1e0" },
                  "&:hover fieldset": { borderColor: "#a9bdd0" },
                  "&.Mui-focused fieldset": { borderColor: "#6b8bb7" },
                },
              }}
            />
          </Box>

          {/* Transcript content */}
          <Box
            sx={{
              padding: "28px",
              backgroundColor: "#fafbfc",
              maxHeight: "450px",
              overflowY: "auto",
              borderBottom: "1px solid #e6eaf0",
            }}
          >
            {(() => {
              const transcriptText = obj1?.responseText?.transcript || " "
              const processedTranscript = []
              const parts = transcriptText.split(/(?=User:|Agent:)/g)

              parts.forEach((part) => {
                if (part.startsWith("User:")) {
                  processedTranscript.push({
                    speaker: "User",
                    text: part.replace("User:", "").trim(),
                  })
                } else if (part.startsWith("Agent:")) {
                  processedTranscript.push({
                    speaker: "Agent",
                    text: part.replace("Agent:", "").trim(),
                  })
                }
              })

              return processedTranscript.map((message, index) => {
                if (message.speaker === "Agent") {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        marginBottom: 2.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#3a5a7a",
                          width: 36,
                          height: 36,
                          marginRight: 2,
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <SupportAgentIcon fontSize="small" />
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          maxWidth: "80%",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#5d6b7b",
                            marginBottom: 0.5,
                            fontWeight: 500,
                            marginLeft: 1.5,
                            fontFamily: "Georgia, Times, serif",
                          }}
                        >
                          Agent
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: "#edf4fa",
                            borderRadius: "4px",
                            padding: "12px 16px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                            border: "1px solid #d9e6f2",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#333f4d",
                              fontSize: "0.95rem",
                              lineHeight: 1.6,
                              fontFamily: "Georgia, Times, serif",
                            }}
                          >
                            {highlightText(message.text.replace(/\\/g, ""), searchTerm)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )
                } else if (message.speaker === "User") {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        marginBottom: 2.5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          maxWidth: "80%",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#5d6b7b",
                            marginBottom: 0.5,
                            fontWeight: 500,
                            marginRight: 1.5,
                            fontFamily: "Georgia, Times, serif",
                          }}
                        >
                          User
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: "#f5f7f9",
                            borderRadius: "4px",
                            padding: "12px 16px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                            border: "1px solid #e0e6ed",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#333f4d",
                              fontSize: "0.95rem",
                              lineHeight: 1.6,
                              fontFamily: "Georgia, Times, serif",
                              textAlign: "right",
                            }}
                          >
                            {highlightText(message.text.replace(/\\/g, ""), searchTerm)}
                          </Typography>
                        </Box>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: "#5a7d7c",
                          width: 36,
                          height: 36,
                          marginLeft: 2,
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    </Box>
                  )
                }
                return null
              })
            })()}
          </Box>
        </DialogContent>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: "#f0f4f8",
            borderTop: "1px solid #e0e6ed",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleCloseTranscriptDialog}
            sx={{
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 400,
              padding: "6px 18px",
              fontFamily: "Georgia, Times, serif",
              color: "#2c3e50",
              backgroundColor: "#ffffff",
              border: "1px solid #c3d1e0",
              "&:hover": {
                backgroundColor: "#f5f7f9",
                borderColor: "#a9bdd0",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

export default DiffDialog