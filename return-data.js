globalThis.HOKURIKU_RETURN={
  "schemaVersion": "1.3",
  "id": "hokuriku-2026-12-10-return",
  "title": "12/10 INOVA 至富山機場回程執行流程",
  "date": "2026-12-10",
  "weekday": "星期四",
  "timezone": "Asia/Tokyo",
  "appSection": "12/10 回程執行",
  "party": {
    "adults": 2,
    "children": [
      {
        "name": "Rex",
        "age": 7
      },
      {
        "name": "Abby",
        "age": 3
      }
    ],
    "suitcases": 4
  },
  "flight": {
    "flightNumber": "CI371",
    "airline": "China Airlines",
    "origin": "TOY",
    "destination": "TPE",
    "scheduledDeparture": "18:35",
    "scheduledArrivalTaipei": "21:25",
    "targetAirportArrival": "16:05",
    "targetBufferMinutes": 150,
    "timeStatus": "2026 winter schedule; reconfirm before departure"
  },
  "hotel": {
    "name": "INOVA Kanazawa Hotel Suite",
    "addressJP": "〒920-0036 石川県金沢市元菊町25-3",
    "phone": "+81-76-223-3133",
    "checkOutTime": "10:00",
    "luggageStorageUntil": "17:00",
    "luggageStorageNote": "退房後可寄放行李，實際交付和取回方式以飯店確認為準"
  },
  "strategy": {
    "defaultSelectedPlan": "rental_car",
    "primary": "rental_car",
    "alternative1": "local_train_two_taxis",
    "alternative2": "local_train_airport_bus",
    "excludedModes": [
      "shinkansen"
    ],
    "rules": [
      "租車自駕為已保留的主方案。",
      "方案一為普通電車加兩台計程車。",
      "方案二為普通電車加機場巴士。",
      "切換App交通方案不會取消或建立任何真實預約。",
      "所有時間使用日本當地時間。",
      "目標16:05以前抵達富山機場。",
      "四件行李與兒童安全需求為必要條件。",
      "價格未知不得顯示為零元或已確認。"
    ]
  },
  "train": {
    "operator": "IRいしかわ鉄道 / あいの風とやま鉄道",
    "service": "普通電車",
    "origin": "金沢駅",
    "destination": "富山駅",
    "direct": true,
    "transfers": 0,
    "stationPreparationBufferMinutes": 20,
    "fareJPY": {
      "adult": 1290,
      "childApprox": 650,
      "familyApprox": 3230
    },
    "choices": [
      {
        "id": "train-1205",
        "departure": "12:05",
        "arrival": "13:03",
        "durationMinutes": 58,
        "recommendedStationArrivalBy": "11:45"
      },
      {
        "id": "train-1305",
        "departure": "13:05",
        "arrival": "14:03",
        "durationMinutes": 58,
        "recommendedStationArrivalBy": "12:45"
      },
      {
        "id": "train-1345",
        "departure": "13:45",
        "arrival": "14:43",
        "durationMinutes": 58,
        "recommendedStationArrivalBy": "13:25"
      },
      {
        "id": "train-1423",
        "departure": "14:23",
        "arrival": "15:23",
        "durationMinutes": 60,
        "recommendedStationArrivalBy": "14:03",
        "warning": "不建議作為回程主要班次"
      }
    ],
    "warnings": [
      "普通電車通常沒有大型專用行李艙。",
      "四件行李不得阻擋車門或通道。",
      "金澤站及富山站有電梯，但可能需要繞路或等待。",
      "風雪或設備故障可能影響列車。",
      "班表需以12/10當天實際運行情況為準。"
    ]
  },
  "planOptions": [
    {
      "id": "rental_car",
      "label": "主方案｜租車自駕",
      "shortLabel": "租車",
      "icon": "car",
      "isDefault": true,
      "bookingStatus": "existing_booking",
      "transferCount": 0,
      "route": [
        "INOVA",
        "租車還車地點",
        "富山機場國際線航廈"
      ],
      "schedule": [
        {
          "time": "10:00",
          "title": "INOVA 退房"
        },
        {
          "time": "12:30",
          "title": "取回行李、整理車輛"
        },
        {
          "time": "13:00",
          "title": "建議出發前往富山機場",
          "note": "依租車還車地點與天氣調整"
        },
        {
          "time": "14:30-15:15",
          "title": "目標完成還車及檢查"
        },
        {
          "time": "15:15-15:45",
          "title": "目標抵達富山機場航廈"
        },
        {
          "time": "18:35",
          "title": "CI371 起飛"
        }
      ],
      "rentalDetails": {
        "company": null,
        "reservationNumber": null,
        "returnLocation": null,
        "returnDeadline": null,
        "returnShuttleConfirmed": false,
        "winterTiresConfirmed": false,
        "childSeatConfirmed": false,
        "boosterSeatConfirmed": false,
        "fuelPolicy": "預計由車行補油並支付費用，須確認允許及收費方式",
        "bookingCostJPY": null
      },
      "checklist": [
        {
          "id": "rental-return",
          "text": "確認租車還車地點及截止時間",
          "done": false
        },
        {
          "id": "rental-shuttle",
          "text": "確認還車點至機場航廈接駁",
          "done": false
        },
        {
          "id": "rental-fuel",
          "text": "確認補油計價、服務費及還車規定",
          "done": false
        },
        {
          "id": "rental-weather",
          "text": "確認12/10天氣及道路積雪結冰狀況",
          "done": false
        },
        {
          "id": "rental-winter-tires",
          "text": "確認雪胎／冬胎配置",
          "done": false
        },
        {
          "id": "rental-child-seat",
          "text": "確認3歲兒童安全座椅",
          "done": false
        },
        {
          "id": "rental-booster-seat",
          "text": "確認7歲兒童增高墊",
          "done": false
        }
      ]
    },
    {
      "id": "local_train_two_taxis",
      "label": "方案一｜普通電車＋兩台計程車",
      "shortLabel": "電車＋2台計程車",
      "icon": "car-front",
      "isDefault": false,
      "bookingStatus": "not_booked",
      "transferCount": 1,
      "route": [
        "INOVA",
        "金澤站",
        "富山站",
        "富山機場國際線航廈"
      ],
      "recommendedTrainId": "train-1305",
      "backupTrainId": "train-1345",
      "schedule": [
        {
          "time": "10:00",
          "title": "INOVA 退房"
        },
        {
          "time": "12:00",
          "title": "取回4件行李，前往金澤站"
        },
        {
          "time": "12:30",
          "title": "抵達金澤站、購票、找電梯"
        },
        {
          "time": "13:05",
          "title": "普通電車從金澤出發"
        },
        {
          "time": "14:03",
          "title": "抵達富山站"
        },
        {
          "time": "14:15",
          "title": "分乘兩台預約計程車"
        },
        {
          "time": "14:35-15:00",
          "title": "預估抵達富山機場"
        },
        {
          "time": "18:35",
          "title": "CI371 起飛"
        }
      ],
      "taxiArrangement": {
        "numberOfVehicles": 2,
        "preferredPickupTime": "14:15",
        "backupPickupTime": "14:55",
        "pickupLocation": "富山站，實際出口與上車點待確認",
        "destination": "富山空港 国際線ターミナル",
        "estimatedRideMinutes": 20,
        "groups": [
          {
            "vehicle": 1,
            "passengers": [
              "Alvin",
              "Rex"
            ],
            "suitcases": 2
          },
          {
            "vehicle": 2,
            "passengers": [
              "Emily",
              "Abby"
            ],
            "suitcases": 2
          }
        ],
        "company": "富山交通",
        "phone": "+81-76-421-1122",
        "dispatchAvailable24Hours": true,
        "reservationConfirmed": false,
        "vehicle1FareJPY": null,
        "vehicle2FareJPY": null,
        "requirements": [
          "預約同時抵達的兩台計程車。",
          "每台搭載一位成人、一位兒童和兩件行李。",
          "確認每台車行李箱容量足夠。",
          "確認3歲兒童適用的安全座椅及7歲兒童增高墊是否可提供。",
          "確認兩台車在同一乘車位置集合。",
          "兩位成人手機均可上網並保持聯絡。",
          "如果火車延誤，通知兩位司機修改時間。",
          "24小時派車不代表保證同時有兩台空車。"
        ]
      },
      "backupSchedule": {
        "trainDeparture": "13:45",
        "trainArrival": "14:43",
        "taxiPickupTarget": "14:55",
        "estimatedAirportArrival": "15:15-15:40"
      },
      "costJPY": {
        "trainFamilyApprox": 3230,
        "taxi1": null,
        "taxi2": null,
        "hotelToStation": null,
        "total": null
      },
      "pros": [
        "不依賴機場巴士班次。",
        "兩台車分攤四件行李。",
        "若提前預約，富山站轉乘彈性較大。"
      ],
      "risks": [
        "兩台計程車需確認能同時派遣。",
        "兩車分開搭乘，成人必須各自照顧一名兒童。",
        "若電車延誤，兩台車都可能需要改時間。",
        "仍須搬運四件行李進出電車。"
      ],
      "checklist": [
        {
          "id": "two-taxis-reserve",
          "text": "向富山交通預約12/10 14:15兩台計程車",
          "done": false
        },
        {
          "id": "two-taxis-luggage",
          "text": "確認每台車可放兩個行李箱",
          "done": false
        },
        {
          "id": "two-taxis-child",
          "text": "確認兒童座椅與增高墊安排",
          "done": false
        },
        {
          "id": "two-taxis-location",
          "text": "確認富山站兩台計程車集合位置",
          "done": false
        },
        {
          "id": "two-taxis-quote",
          "text": "確認兩台車各自車資及取消規定",
          "done": false
        }
      ]
    },
    {
      "id": "local_train_airport_bus",
      "label": "方案二｜普通電車＋機場巴士",
      "shortLabel": "電車＋機場巴士",
      "icon": "bus",
      "isDefault": false,
      "bookingStatus": "not_applicable",
      "transferCount": 1,
      "route": [
        "INOVA",
        "金澤站",
        "富山站南口6號巴士站",
        "富山機場"
      ],
      "recommendedTrainId": "train-1205",
      "alternativeTrainId": "train-1305",
      "lateTrainId": "train-1345",
      "schedule": [
        {
          "time": "10:00",
          "title": "INOVA 退房"
        },
        {
          "time": "11:15",
          "title": "取回行李，前往金澤站"
        },
        {
          "time": "11:45",
          "title": "抵達金澤站"
        },
        {
          "time": "12:05",
          "title": "普通電車從金澤出發"
        },
        {
          "time": "13:03",
          "title": "抵達富山站"
        },
        {
          "time": "13:03-14:10",
          "title": "休息、前往南口6號巴士站"
        },
        {
          "time": "14:25",
          "title": "搭乘36系統機場巴士"
        },
        {
          "time": "14:49",
          "title": "抵達富山機場"
        },
        {
          "time": "18:35",
          "title": "CI371 起飛"
        }
      ],
      "airportBus": {
        "operator": "富山地方鉄道",
        "service": "36系統，途中停靠站點",
        "boardingLocation": "富山駅前 南口 6番のりば",
        "destination": "富山空港前",
        "booked": false,
        "seatCapacityLimited": true,
        "largeLuggageCapacityConfirmed": false,
        "fareAdultJPY": 470,
        "fareChildApproxJPY": 240,
        "fareFamilyApproxJPY": 1180,
        "childrenFareNote": "兩大一位7歲兒童、一位3歲幼兒隨行的估算；實際票價依乘車規則確認",
        "paymentNote": "36系統不適用機場直達巴士的信用卡感應支付，準備日圓現金及零錢",
        "timetable": [
          {
            "id": "bus-1425",
            "departure": "14:25",
            "arrival": "14:49",
            "durationMinutes": 24,
            "recommended": true,
            "airportArrivalBeforeTarget": true
          },
          {
            "id": "bus-1550",
            "departure": "15:50",
            "arrival": "16:14",
            "durationMinutes": 24,
            "recommended": false,
            "airportArrivalBeforeTarget": false,
            "warning": "比16:05機場抵達目標晚9分鐘"
          },
          {
            "id": "bus-1640",
            "departure": "16:40",
            "arrival": "17:04",
            "durationMinutes": 24,
            "recommended": false,
            "airportArrivalBeforeTarget": false,
            "warning": "距離航班太近，不建議使用"
          }
        ],
        "trainBusConnections": [
          {
            "id": "connection-safe",
            "trainDeparture": "12:05",
            "trainArrival": "13:03",
            "busDeparture": "14:25",
            "busArrivalAirport": "14:49",
            "transferBufferMinutes": 82,
            "risk": "low",
            "label": "穩健方案"
          },
          {
            "id": "connection-tight",
            "trainDeparture": "13:05",
            "trainArrival": "14:03",
            "busDeparture": "14:25",
            "busArrivalAirport": "14:49",
            "transferBufferMinutes": 22,
            "risk": "high",
            "label": "轉乘時間偏短"
          },
          {
            "id": "connection-late",
            "trainDeparture": "13:45",
            "trainArrival": "14:43",
            "busDeparture": "15:50",
            "busArrivalAirport": "16:14",
            "transferBufferMinutes": 67,
            "risk": "medium",
            "label": "較晚抵達機場"
          },
          {
            "id": "connection-latest",
            "trainDeparture": "14:23",
            "trainArrival": "15:23",
            "busDeparture": "15:50",
            "busArrivalAirport": "16:14",
            "transferBufferMinutes": 27,
            "risk": "high",
            "label": "不建議"
          }
        ],
        "warnings": [
          "不是12/3的台北航班免費接駁巴士。",
          "14:25與15:50為36系統公車，不是專用直達巴士。",
          "四件大行李的裝載空間尚未獲得業者確認。",
          "巴士採座位定員制，客滿可能無法上車。",
          "巴士誤點、客滿或錯過班次，須立即評估計程車備案。",
          "建議提前至少15分鐘到6號站牌候車。"
        ]
      },
      "costJPY": {
        "trainFamilyApprox": 3230,
        "busFamilyApprox": 1180,
        "trainAndBusFamilyApprox": 4410,
        "hotelToStation": null,
        "totalIncludingHotelTransport": null
      },
      "pros": [
        "不必提前預約計程車。",
        "整體交通費較低。",
        "採用12:05電車有較充裕的轉乘緩衝。"
      ],
      "risks": [
        "富山站需要等待機場巴士。",
        "四件大型行李未必能順利放上公車。",
        "錯過機場巴士可能延誤很久。",
        "13:05電車接14:25巴士只有22分鐘轉乘。"
      ],
      "checklist": [
        {
          "id": "bus-luggage",
          "text": "向富山地方鐵道確認36系統能否載運4個行李箱",
          "done": false
        },
        {
          "id": "bus-platform",
          "text": "保存富山站南口6號巴士站位置",
          "done": false
        },
        {
          "id": "bus-fare",
          "text": "準備巴士現金車資及零錢",
          "done": false
        },
        {
          "id": "bus-timetable",
          "text": "12/10確認機場巴士是否正常營運",
          "done": false
        }
      ]
    }
  ],
  "decisionGuide": {
    "default": {
      "planId": "rental_car",
      "reason": "已保留租車，減少回程轉乘和行李搬運"
    },
    "ifRentalUnavailable": {
      "preferred": "local_train_two_taxis",
      "condition": "兩台計程車能事先確認並同時派遣"
    },
    "ifBusSelected": {
      "preferredConnection": "connection-safe",
      "reason": "預留82分鐘轉乘，較適合4件行李與2位兒童"
    },
    "ifTrainDelayed": {
      "action": "重新計算後續交通；超過16:05機場目標時間顯示警告"
    },
    "ifBusMissed": {
      "action": "顯示富山交通電話，優先評估兩台計程車"
    },
    "ifPredictedAirportArrivalAfter": "16:05",
    "riskMessage": "注意：預估抵達機場時間已晚於原訂目標，請改選較早班次或更可靠的交通方式。"
  },
  "contacts": [
    {
      "id": "inova",
      "name": "INOVA Kanazawa",
      "phone": "+81-76-223-3133",
      "addressJP": "〒920-0036 石川県金沢市元菊町25-3"
    },
    {
      "id": "toyama_taxi",
      "name": "富山交通",
      "phone": "+81-76-421-1122",
      "hours": "24小時派車",
      "website": "https://www.tomitaku.co.jp/taxi/"
    },
    {
      "id": "toyama_bus",
      "name": "富山地方鐵道巴士",
      "phone": "+81-76-432-3456",
      "website": "https://www.chitetsu.co.jp/?page_id=733"
    }
  ],
  "phrasesJapanese": {
    "twoTaxis": "12月10日14時15分に富山駅から富山空港まで、タクシーを2台予約したいです。大人2名、子供2名、スーツケース4個です。各車に大人1名、子供1名、スーツケース2個ずつ乗ります。",
    "taxiMeetingPoint": "2台とも同じ場所で待ち合わせできますか？",
    "childSeats": "3歳の子供用チャイルドシートと7歳の子供用ジュニアシートは用意できますか？",
    "busLocation": "富山空港行きのバスが出る南口6番のりばはどこですか？",
    "busLuggage": "大人2名、子供2名で、スーツケースが4個あります。このバスに全部載せられますか？",
    "trainDelay": "電車が遅れています。予約したタクシー2台の迎車時間を変更できますか？",
    "airportTaxi": "富山空港の国際線ターミナルまでお願いします。"
  },
  "globalChecklist": [
    {
      "id": "checkout",
      "text": "12/10 10:00前完成INOVA退房",
      "done": false
    },
    {
      "id": "passports",
      "text": "確認全家4本護照與機票資訊",
      "done": false
    },
    {
      "id": "fourbags",
      "text": "確認4件行李全部取回",
      "done": false
    },
    {
      "id": "flight",
      "text": "確認CI371航班正常與報到時間",
      "done": false
    },
    {
      "id": "weather",
      "text": "確認金澤至富山天氣、道路及鐵路運行狀況",
      "done": false
    }
  ],
  "sourceUrls": {
    "flight": "https://www.toyama-airport.co.jp/",
    "trainOfficial": "https://www.ishikawa-railway.jp/station/kanazawa/",
    "trainTimetable": "https://www.ishikawa-railway.jp/ishi-train/station/kanazawa/",
    "busOfficial": "https://www.chitetsu.co.jp/?page_id=733",
    "busWinterTimetablePdf": "https://www.chitetsu.co.jp/wp-content/uploads/2026/10/9bb299687ec3e71f11ea7db7b48c9512-2.pdf",
    "taxiOfficial": "https://www.tomitaku.co.jp/taxi/",
    "airportTaxi": "https://www.toyama-airport.co.jp/access/taxi",
    "hotel": "https://kanazawahotel.jp/",
    "trainOperatingStatus": "https://www.ishikawa-railway.jp/",
    "toyamaOperatingStatus": "https://trafficinfo.ainokaze.co.jp/",
    "flightToday": "https://www.toyama-airport.co.jp/getonboard/flight-information",
    "busStop": "https://www.chitetsu.co.jp/wp-content/themes/custom2/pdf/stationbusstop.pdf"
  },
  "appIntegration": {
    "tab": "12/10 回程執行",
    "defaultPlanId": "rental_car",
    "features": [
      "三方案切換",
      "流程時間軸",
      "Checklist勾選",
      "列車與巴士班表",
      "列車到站時間自動推薦交通",
      "兩台計程車分車資訊",
      "車資比較",
      "機場抵達時間警示",
      "官方查詢連結",
      "電話撥號",
      "日文求助句複製"
    ],
    "localStorageKeys": {
      "selectedPlan": "hokuriku2026.day8.selectedPlan",
      "completedSteps": "hokuriku2026.day8.completedSteps",
      "checklist": "hokuriku2026.day8.checklist",
      "bookings": "hokuriku2026.day8.bookings",
      "fareQuotes": "hokuriku2026.day8.fareQuotes"
    },
    "migration": {
      "previousVersion": "1.2",
      "newVersion": "1.3",
      "oldPrivateTransferPlanId": "private_transfer",
      "oldTrainTaxiPlanId": "local_train_and_taxi",
      "newPlan1Id": "local_train_two_taxis",
      "newPlan2Id": "local_train_airport_bus",
      "preserveRentalBookingData": true,
      "preserveExistingUserData": true,
      "doNotOverwriteDay1": true,
      "doNotAddShinkansen": true,
      "doNotAutoCancelBookings": true
    }
  },
  "lastUpdated": "2026-11-10",
  "disclaimer": "列車與巴士時刻依目前公布的2026年班表整理。出發當天應重新查詢。所有計程車調度、行李容量、兒童座椅及實際車資必須另行確認。",
  "verification": {
    "checkedAt": "2026-11-10",
    "status": "參考班表與官方查詢連結；12/10 班次、票價、車型與行李容量均須當天再確認。"
  }
};
