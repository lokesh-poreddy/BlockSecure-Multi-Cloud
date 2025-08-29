;; BlockSecure Multi-Cloud Log Anchoring Contract
;; This contract stores log hashes on the Stacks blockchain for tamper-proof verification

;; Define data maps
(define-map log-anchors 
  { log-hash: (buff 32) }
  { 
    anchored-by: principal,
    block-height: uint,
    timestamp: uint,
    metadata: (optional (string-utf8 256))  ;; Added metadata field
  }
)

;; Define data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var total-logs uint u0)  ;; Track total logs anchored

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-LOG-ALREADY-EXISTS (err u101))
(define-constant ERR-LOG-NOT-FOUND (err u102))
(define-constant ERR-INVALID-BATCH-SIZE (err u103))

;; Owner-only check
(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Transfer ownership
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (ok (var-set contract-owner new-owner))
  )
)

;; Public function to anchor a single log hash with metadata
(define-public (anchor-log (log-hash (buff 32)) (metadata (optional (string-utf8 256))))
  (let ((existing-log (map-get? log-anchors { log-hash: log-hash })))
    (if (is-some existing-log)
      ERR-LOG-ALREADY-EXISTS
      (begin
        (map-set log-anchors 
          { log-hash: log-hash }
          {
            anchored-by: tx-sender,
            block-height: block-height,
            timestamp: (unwrap-panic (get-block-info? time (- block-height u1))),
            metadata: metadata
          }
        )
        (var-set total-logs (+ (var-get total-logs) u1))
        (print { type: "log-anchored", hash: log-hash, by: tx-sender })
        (ok true)
      )
    )
  )
)

;; Public function to anchor multiple log hashes at once
(define-public (anchor-logs (log-hashes (list 20 (buff 32))))
  (begin
    (asserts! (> (len log-hashes) u0) ERR-INVALID-BATCH-SIZE)
    (ok (map anchor-log-batch log-hashes))
  )
)

;; Private helper for batch anchoring
(define-private (anchor-log-batch (log-hash (buff 32)))
  (match (map-get? log-anchors { log-hash: log-hash })
    prev-data false  ;; Skip if exists
    (begin
      (map-set log-anchors 
        { log-hash: log-hash }
        {
          anchored-by: tx-sender,
          block-height: block-height,
          timestamp: (unwrap-panic (get-block-info? time (- block-height u1))),
          metadata: none
        }
      )
      (var-set total-logs (+ (var-get total-logs) u1))
      true
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

;; Read-only function to get total logs anchored
(define-read-only (get-total-logs)
  (var-get total-logs)
)

;; Admin function to get contract owner
(define-read-only (get-contract-owner)
  (var-get contract-owner)
)
