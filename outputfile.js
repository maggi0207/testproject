import { Box, Grid } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import MuiButton from 'framework/components/MuiButton'
import React, { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import MuiLoader from 'framework/components/MuiLoader'
import { useIsMobileScreen } from 'library/hooks'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
import { ReactComponent as ZoomInIcon } from '../../../images/zoomIn.svg'
import { ReactComponent as ZoomOutIcon } from '../../../images/zoomOut.svg'

interface DocumentDialogProps {
    fileUrl?: string
    open?: any
    preview?: boolean
    onAgree?: (fileUrl: string) => void
    onDecline?: (fileUrl: string) => void
}

export const DocumentDialog = ({ fileUrl, open, preview, onAgree, onDecline }: DocumentDialogProps) => {
    console.log(preview, '=====preview')
    const [numPages, setNumPages] = useState(null)
    const [showButton, setShowButton] = useState(false)
    const isMobile = useIsMobileScreen()
    const [shouldButtonEnabled, setShouldButtonEnabled] = useState(preview ? true : false)
    const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)
    const [scale, setScale] = useState(1)

    const handleScroll = () => {
        const scrollableElement = document.getElementsByClassName('MuiDialog-paperScrollPaper')[0] as HTMLElement
        if (scrollableElement) {
            const { scrollTop, scrollHeight, clientHeight } = scrollableElement
            if (scrollTop + clientHeight >= scrollHeight - 3) {
                setShouldButtonEnabled(true)
            }
        }
    }

    useEffect(() => {
        let scrollableElement: HTMLElement | null = null
        let timeoutId: NodeJS.Timeout

        if (open) {
            // Delay to ensure the scrollable element is rendered when we reopen
            timeoutId = setTimeout(() => {
                scrollableElement = document.getElementsByClassName('MuiDialog-paperScrollPaper')[0] as HTMLElement
                if (scrollableElement) {
                    scrollableElement.addEventListener('scroll', handleScroll)
                }
            }, 100)
        }

        return () => {
            if (scrollableElement) {
                scrollableElement.removeEventListener('scroll', handleScroll)
            }
            clearTimeout(timeoutId)
        }
    }, [open, isDocumentLoaded, isMobile])

    useEffect(() => {
        // Prevent pinch zoom
        const disablePinchZoom = (event: TouchEvent) => {
            if (event.touches.length > 1) {
                event.preventDefault()
            }
        }
        document.addEventListener('touchmove', disablePinchZoom, { passive: false })
        return () => {
            document.removeEventListener('touchmove', disablePinchZoom)
        }
    }, [])

    const handleScrollTop = () => {
        const scrollableElement = document.getElementsByClassName('MuiDialog-paperScrollPaper')[0] as HTMLElement
        if (scrollableElement) {
            scrollableElement.scrollTop = 0
        }
    }

    const handleDeclineDocument = () => {
        setShowButton(false)
        handleScrollTop()
        onDecline && onDecline(fileUrl as string)
    }

    const handleAgreeDocument = () => {
        setShowButton(false)
        handleScrollTop()
        onAgree && onAgree(fileUrl as string)
    }

    const onDocumentLoadSuccess = (numPagesNew: any) => {
        console.log('numPagesNew------', numPagesNew._pdfInfo.numPages)
        setNumPages(numPagesNew._pdfInfo.numPages)
        setIsDocumentLoaded(true)
        setShouldButtonEnabled(preview ? true : false)
        setShowButton(true)

        setTimeout(() => {
            handleScroll()
        }, 100)
    }

    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 2)) //2x
    }

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)) //0.5x
    }

    return (
        <div className="pdf-wrapper">
            <Dialog open={open} className="app-wrapper">
                <Grid
                    container
                    className="quote-wrapper"
                    minHeight={876}
                    height="auto"
                    flexDirection="column"
                    sx={{
                        position: 'relative',
                        px: { xs: '10px', lg: '55px' },
                        py: { xs: '10px', lg: '55px' },
                        minWidth: { xs: '300px', lg: '725px' },
                        flexWrap: 'nowrap !important',
                    }}
                >
                    <div className="centered-div" style={{ marginBottom: isMobile ? '24px' : '42px' }}>
                        <span
                            style={{
                                textAlign: 'left',
                                fontFamily: isMobile ? 'Lato' : 'Rubik',
                                color: '#257357',
                                fontWeight: '700',
                                fontSize: isMobile ? '18px' : '20px',
                                lineHeight: isMobile ? '28.8px' : '30px',
                            }}
                        >
                            Please scroll down to review the agreement.
                        </span>
                    </div>
                    <Grid item>
                        <Document
                            className="small-screen-pdf pdf-grow"
                            file={"https://marketing-medias.s3.us-east-1.amazonaws.com/medias/mobile-onboarding.pdf"}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={(err) => {
                                console.log('FAILED LOADING DOC ', err.message)
                            }}
                            loading={<MuiLoader message=" " style={{ background: 'transparent' }} />}
                            noData={<MuiLoader message=" " style={{ background: 'transparent' }} />}
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    height={794}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={isMobile ? document.documentElement.clientWidth * 0.9 : undefined}
                                    scale={scale}
                                    className="pdf-page"
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                />
                            ))}
                        </Document>
                    </Grid>
                    {showButton && (
                        <div
                            style={{
                                position: 'sticky',
                                zIndex: 1,
                                bottom: 0,
                            }}
                        >
                            <div style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
                                <ZoomOutIcon style={{ cursor: 'pointer' }} onClick={zoomOut} />
                                <ZoomInIcon style={{ cursor: 'pointer' }} onClick={zoomIn} />
                            </div>
                            <div style={{ backgroundColor: 'white', padding: '10px 0 40px 0' }}>
                                <Box className="hr-double" sx={{ mb: { xs: '10px', sm: '21px' } }} />
                                <Grid
                                    container
                                    sx={{
                                        backgroundColor: 'white',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: 'center',
                                        justifyContent: { xs: 'center', sm: 'space-around' },
                                    }}
                                >
                                    <Grid item xs={12} sm={4} sx={{ order: { xs: 1, sm: 2 }, width: '100%', mb: { xs: 2, sm: 0 } }}>
                                        <MuiButton
                                            id="disclosure-document-agree"
                                            className="btn-green btn-w-unset w-full"
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                            text={'Agree'}
                                            disabled={!shouldButtonEnabled}
                                            onClick={handleAgreeDocument}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} sx={{ order: { xs: 2, sm: 1 }, width: '100%' }}>
                                        <MuiButton
                                            id="disclosure-document-decline"
                                            className="btn-transparent btn-w-unset w-full"
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                            text={'Decline'}
                                            disabled={!shouldButtonEnabled}
                                            onClick={handleDeclineDocument}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    )}
                </Grid>
            </Dialog>
        </div>
    )
}
