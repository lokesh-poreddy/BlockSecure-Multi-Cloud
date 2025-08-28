;; BlockSecure Multi-Cloud Log Anchoring Contract
;; This contract stores log hashes on the Stacks blockchain for tamper-proof verification

;; Define data maps
(define-map log-anchors 
  { log-hash: (buff 32) }
  { 
    anchored-by: principal,
    block-height: uint,
    timestamp: uint
  }
)

;; Define data variables
(define-data-var contract-owner principal tx-sender)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-LOG-ALREADY-EXISTS (err u101))
(define-constant ERR-LOG-NOT-FOUND (err u102))

;; Public function to anchor a log hash
(define-public (anchor-log (log-hash (buff 32)))
  (let ((existing-log (map-get? log-anchors { log-hash: log-hash })))
    (if (is-some existing-log)
      ERR-LOG-ALREADY-EXISTS
      (begin
        (map-set log-anchors 
          { log-hash: log-hash }
          {
            anchored-by: tx-sender,
            block-height: block-height,
            timestamp: (unwrap-panic (get-block-info? time (- block-height u1)))
          }
        )
        (ok true)
      )
    )
  )
)

;; Read-only function to verify a log hash exists
(define-read-only (verify-log (log-hash (buff 32)))
  (match (map-get? log-anchors { log-hash: log-hash })
    anchor-data (ok anchor-data)
    ERR-LOG-NOT-FOUND
  )
)

;; Read-only function to get log anchor details
(define-read-only (get-log-anchor (log-hash (buff 32)))
  (map-get? log-anchors { log-hash: log-hash })
)

;; Read-only function to check if log exists
(define-read-only (log-exists (log-hash (buff 32)))
  (is-some (map-get? log-anchors { log-hash: log-hash }))
)

;; Admin function to get contract owner
(define-read-only (get-contract-owner)
  (var-get contract-owner)
)
