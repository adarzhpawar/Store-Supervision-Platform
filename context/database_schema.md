# Database Schema

## workers

id uuid pk

name varchar

phone varchar

email varchar

role varchar

salary numeric

status varchar

created_at timestamp

---

## inventory

id uuid pk

sku varchar unique

name varchar

category varchar

price numeric

cost_price numeric

stock integer

min_stock integer

barcode varchar

created_at timestamp

updated_at timestamp

---

## bills

id uuid pk

invoice_number varchar unique

customer_name varchar

subtotal numeric

discount numeric

tax numeric

total numeric

payment_method varchar

notes text

created_at timestamp

---

## bill_items

id uuid pk

bill_id uuid fk

product_id uuid fk

quantity integer

unit_price numeric

total_price numeric

---

## attendance

id uuid pk

worker_id uuid fk

date date

status varchar

---

## Relationships

Bill
→ Bill Items

Worker
→ Attendance