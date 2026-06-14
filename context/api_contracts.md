# API Contracts

## Create Product

POST

/api/inventory

Request

{
"name":"Laptop",
"price":999
}

Response

{
"success":true
}

---

## Create Bill

POST

/api/bills

Request

{
"items":[]
}

Response

{
"invoiceId":"INV-001"
}

---

## Download Invoice

GET

/api/bills/:id/pdf

Returns PDF

---

## Revenue Analytics

GET

/api/revenue

Response

{
"daily":1000,
"monthly":30000
}