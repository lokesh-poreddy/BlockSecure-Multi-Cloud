;; Log Security Contract
(define-map logs 
    { hash: (buff 32) } 
    {
        owner: principal,
        timestamp: uint,
        provider: (string-ascii 32),
        verified: bool
    }
)

(define-public (store-log (hash (buff 32)) (provider (string-ascii 32)))
    (let
        ((caller tx-sender))
        (ok (map-set logs
            { hash: hash }
            {
                owner: caller,
                timestamp: block-height,
                provider: provider,
                verified: true
            }
        ))
    )
)

(define-read-only (verify-log (hash (buff 32)))
    (match (map-get? logs { hash: hash })
        log-data (ok true)
        (err u404)
    )
)

(define-read-only (get-log-details (hash (buff 32)))
    (map-get? logs { hash: hash })
)