
export const getFedexRatePayload = (weightValue, shipper, recipient, preferredCurrency = "VND", packagingType) => {
  return {
    accountNumber: {
      value: "740561073"
    },
    requestedShipment: {
      shipper: {
        address: {
          postalCode: shipper?.shipmentPostalCode,
          countryCode: shipper?.shipmentCountryCode
        }
      },
      recipient: {
        address: {
          postalCode: recipient?.recipientPostalCode,
          countryCode: recipient?.recipientCountryCode
        }
      },
      pickupType: "CONTACT_FEDEX_TO_SCHEDULE",
      rateRequestType: [
        "PREFERRED"
      ],
      packagingType: packagingType,
      preferredCurrency: preferredCurrency,
      requestedPackageLineItems: [
        {
          weight: {
            units: "KG",
            value: weightValue
          }
        }
      ]
    }
  }
}

export const sampleRate = {
  accountNumber: { value: "740561073" },
  requestedShipment: {
    shipper: {
      address: {
        postalCode: "30301",
        countryCode: "US",
        city: "Atlanta"
      }
    },
    recipient: {
      address: {
        postalCode: "70000",
        countryCode: "VN",
        city: "Ho Chi Minh City"
      }
    },
    pickupType: "CONTACT_FEDEX_TO_SCHEDULE",
    packagingType: "",
    rateRequestType: ["PREFERRED"],
    preferredCurrency: "VND",
    requestedPackageLineItems: [
      { weight: { units: "KG", value: 21 } }
    ]
  }
}


export const getFedexCreateShipPayload = (weightValue, shipper, recipient, preferredCurrency = "VND", selectedRateType, packagingType) => {
  return {
    accountNumber: {
      value: "740561073"
    },
    requestedShipment: {
      shipper: {
        address: {
          postalCode: "30301",
          streetLines: ["22/12/3 Louis"],
          city: "Atlanta",
          countryCode: "US",
          stateOrProvinceCode: "GA"
        },
        contact: {
          personName: shipper?.shipmentName,
          phoneNumber: shipper?.shipmentPhone
        }
      },
      recipients: [
        {
          address: {
            postalCode: recipient?.recipientPostalCode,
            streetLines: [recipient?.recipientStreetLine],
            city: recipient?.recipientCity,
            countryCode: recipient?.recipientCountryCode
          },
          contact: {
            personName: recipient?.recipientName,
            phoneNumber: recipient?.recipientPhone
          }
        }
      ],
      pickupType: "CONTACT_FEDEX_TO_SCHEDULE",
      serviceType: selectedRateType,
      customsClearanceDetail: {
        totalCustomsValue: {
          amount: 100,
          currency: "USD"
        },
        documentContent: "COMMODITY",
        dutiesPayment: {
          paymentType: "SENDER"
        },
        commodities: [
          {
            description: "Books",
            countryOfManufacture: "US",
            numberOfPieces: "1",
            weight: {
              value: "23",
              units: "KG"
            },
            quantity: "1",
            quantityUnits: "PCS",
            unitPrice: {
              amount: "100",
              currency: "USD"
            },
            customsValue: {
              amount: "100",
              currency: "USD"
            }
          }
        ]
      },
      packagingType: packagingType,
      totalWeight: weightValue,
      shippingChargesPayment: {
        paymentType: "SENDER",
      },
      labelSpecification: {
        labelStockType: "PAPER_4X6",
        imageType: "PDF"
      },
      requestedPackageLineItems: [
        {
          weight: {
            units: "KG",
            value: weightValue
          }
        }
      ],
      preferredCurrency: preferredCurrency,
    },
    labelResponseOptions: "URL_ONLY"
  }
}

// {
//   "accountNumber": {
//     "value": "740561073"
//   },
//   "requestedShipment": {
//     "shipper": {
//       "address": {
//         "streetLines": [
//           "22/12/3 Louis"
//         ],
//         "city": "Atlanta",
//         "stateOrProvinceCode": "GA",
//         "postalCode": "30301",
//         "countryCode": "US"
//       },
//       "contact": {
//         "personName": "John",
//         "phoneNumber": "0786424999"
//       }
//     },
//     "recipients": [
//       {
//         "address": {
//           "streetLines": [
//             "22/12/3 Louis"
//           ],
//           "city": "TP vung tau",
//           "countryCode": "VN"
//         },
//         "contact": {
//           "personName": "Nguyen Truong Tho",
//           "phoneNumber": "0786424999"
//         }
//       }
//     ],
//     "pickupType": "CONTACT_FEDEX_TO_SCHEDULE",
//     "serviceType": "FEDEX_INTERNATIONAL_PRIORITY",
//     "packagingType": "FEDEX_25KG_BOX",
//     "totalWeight": 23,
//     "shippingChargesPayment": {
//       "paymentType": "SENDER"
//     },
//     "labelSpecification": {
//       "labelStockType": "PAPER_4X6",
//       "imageType": "PDF"
//     },
//     "requestedPackageLineItems": [
//       {
//         "weight": {
//           "units": "KG",
//           "value": 23
//         }
//       }
//     ],
//     "preferredCurrency": "VND",
//     "customsClearanceDetail": {
//       "totalCustomsValue": {
//         "amount": 100,
//         "currency": "USD"
//       },
//       "documentContent": "COMMODITY",
//       "dutiesPayment": {
//         "paymentType": "SENDER"
//       },
//       "commodities": [
//         {
//           "description": "Books",
//           "countryOfManufacture": "US",
//           "numberOfPieces": "1",
//           "weight": {
//             "value": "23",
//             "units": "KG"
//           },
//           "quantity": "1",
//           "quantityUnits": "PCS",
//           "unitPrice": {
//             "amount": "100",
//             "currency": "USD"
//           },
//           "customsValue": {
//             "amount": "100",
//             "currency": "USD"
//           }
//         }
//       ]
//     }
//   },
//   "labelResponseOptions": "URL_ONLY"
// }

