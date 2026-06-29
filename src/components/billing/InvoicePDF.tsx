"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 3,
  },
  text: {
    fontSize: 10,
    color: "#333333",
  },
  table: {
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#666666",
    textTransform: "uppercase",
  },
  tableCell: {
    fontSize: 10,
    color: "#1a1a1a",
  },
  totalsContainer: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "45%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  grandTotalText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#888888",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 10,
  },
});

const getHexColor = (color: string) => {
  switch (color) {
    case "red": return "#b71422";
    case "blue": return "#2563eb";
    case "emerald": return "#059669";
    case "zinc": return "#18181b";
    case "amber": return "#d97706";
    default: return "#000000";
  }
};

export type InvoiceItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type InvoiceData = {
  invoiceNumber: string;
  date: string;
  storeName: string;
  accentColor: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
};

export const InvoicePDF = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ ...styles.title, color: getHexColor(data.accentColor) }}>
          {data.storeName.toUpperCase()}
        </Text>
        <Text style={styles.subtitle}>RECEIPT / TAX INVOICE</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.boldText}>Billed To:</Text>
          <Text style={styles.text}>{data.customerName || "Walk-in Customer"}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.text}>Invoice No: {data.invoiceNumber}</Text>
          <Text style={styles.text}>
            Date: {new Date(data.date).toLocaleDateString()}
          </Text>
          <Text style={styles.text}>Payment: {data.paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.col1, styles.tableHeaderCell]}>Item</Text>
          <Text style={[styles.col2, styles.tableHeaderCell]}>Qty</Text>
          <Text style={[styles.col3, styles.tableHeaderCell]}>Price</Text>
          <Text style={[styles.col4, styles.tableHeaderCell]}>Amount</Text>
        </View>

        {data.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.col1, styles.tableCell]}>{item.name}</Text>
            <Text style={[styles.col2, styles.tableCell]}>{item.quantity}</Text>
            <Text style={[styles.col3, styles.tableCell]}>
              ₹{item.unitPrice.toFixed(2)}
            </Text>
            <Text style={[styles.col4, styles.tableCell]}>
              ₹{item.totalPrice.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.text}>Subtotal:</Text>
          <Text style={styles.text}>₹{data.subtotal.toFixed(2)}</Text>
        </View>
        {data.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.text}>Discount:</Text>
            <Text style={styles.text}>-₹{data.discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.text}>Tax:</Text>
          <Text style={styles.text}>₹{data.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalText}>Total:</Text>
          <Text style={styles.grandTotalText}>₹{data.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={{ ...styles.footer, borderTopColor: getHexColor(data.accentColor) }}>
        <Text>Thank you for shopping at {data.storeName}!</Text>
        <Text>For returns or exchanges, please retain this receipt.</Text>
      </View>
    </Page>
  </Document>
);
