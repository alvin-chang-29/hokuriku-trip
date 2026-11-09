globalThis.HOKURIKU_DAY_ONE={
  "schemaVersion": "1.1",
  "id": "hokuriku-2026-12-03-airport-arrival",
  "title": "12/3 富山機場 → 金澤 INOVA｜第一天執行流程（普通電車版）",
  "date": "2026-12-03",
  "weekday": "星期四",
  "timezone": "Asia/Tokyo",
  "party": {
    "adults": 2,
    "children": [
      {
        "name": "7歲兒童",
        "age": 7
      },
      {
        "name": "3歲兒童",
        "age": 3
      }
    ],
    "suitcases": 4
  },
  "flight": {
    "flightNumber": "CI370",
    "origin": "TPE",
    "destination": "TOY",
    "scheduledArrival": "17:35",
    "status": "航空公司冬季班表預定；當天需核對"
  },
  "route": [
    "富山機場",
    "富山站",
    "金澤站",
    "INOVA Kanazawa"
  ],
  "strategy": {
    "primary": "免費直達接駁巴士到富山站，轉普通電車",
    "fallback": "免費巴士沒搭上或行李無法裝載：叫計程車到富山站",
    "trainChoice": "富山站只搭直達金澤的普通電車；依實際抵達富山站的時間選班次，不安排其他鐵路車種。",
    "lastMile": "金澤站優先叫可放四個行李箱的大型車；若無法取得且天氣安全，考慮步行約650公尺"
  },
  "steps": [
    {
      "id": "land",
      "time": "17:35",
      "title": "CI370 富山機場降落",
      "type": "flight",
      "todo": [
        "通過入境審查",
        "領取4件行李",
        "完成海關檢查",
        "開啟日本eSIM、聯絡家人及查看列車資訊"
      ],
      "note": "通關時間因班機、旅客量而異；不要把18:30視為保證出關時間"
    },
    {
      "id": "free_bus",
      "time": "出關後",
      "title": "尋找免費直達接駁巴士",
      "type": "primary",
      "location": "國際線入境大廳出口附近",
      "estimatedDurationMin": 30,
      "fareJPY": 0,
      "todo": [
        "詢問工作人員「富山駅北口行きの無料バスはどこですか」",
        "確認四名乘客與四件行李能否上車",
        "確認開車時間與下車站富山駅北口",
        "能搭則直接上車"
      ],
      "ifFailedGoTo": "taxi_backup",
      "note": "官方僅公告配合台北航班抵達、約30分鐘、發車可能變動；未保證等最後一位旅客"
    },
    {
      "id": "taxi_backup",
      "time": "免費巴士不可搭時",
      "title": "搭計程車到富山站",
      "type": "fallback",
      "location": "富山機場國內線1樓・2號計程車乘車處",
      "estimatedDurationMin": 20,
      "distanceKm": 9.2,
      "estimatedFareJPY": "約¥5,000–6,000，一般車粗估；大型車需另詢價",
      "call": "+81-76-421-1122",
      "availability": "富山交通配車中心24小時全年無休；不保證機場現場一定有空車",
      "todo": [
        "先到2號計程車乘車處查看車輛",
        "4個行李箱先告知司機；若一般車放不下，要求大型車或由機場服務人員協助叫車",
        "確認可載2大2小及4件行李、等待時間與報價",
        "無大型車時再評估兩台車或其他交通方式"
      ],
      "ifSucceededGoTo": "station"
    },
    {
      "id": "station",
      "time": "抵達富山站後",
      "title": "購票、查看普通電車班次、找電梯上月台",
      "type": "transfer",
      "todo": [
        "在大廳確認往「金沢」的普通電車是否正常行駛",
        "查看列車班表，依抵達富山站的時間選擇；四件行李建議預留至少20分鐘",
        "在あいの風とやま鉄道／IRいしかわ鉄道購買到金沢的普通電車車票",
        "往高岡・金沢方向搭車；官方表常列1號或3號月台，當天以現場看板為準",
        "找エレベーター（電梯）至月台，避免四箱搬上樓梯",
        "班機或接駁未確定前不要提前鎖定列車班次；到站現場再購票"
      ],
      "next": "kanazawa"
    },
    {
      "id": "kanazawa",
      "time": "抵達金澤站後",
      "title": "出站、去 INOVA",
      "type": "last_mile",
      "todo": [
        "循電梯標示下樓，從金沢港口（西口）出站",
        "有4件行李先查看能否叫到足夠行李空間的車；一般計程車可能裝不下",
        "計程車向司機出示日文飯店地址",
        "若無合適車輛且天氣與孩子狀況允許，可步行約650公尺至飯店",
        "依預先取得的流程完成17:00後自助入住"
      ],
      "hotelAddressJP": "〒920-0036 石川県金沢市元菊町25-3"
    }
  ],
  "trainChoices": [
    {
      "id": "local-1903",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "19:03",
      "arriveKanazawa": "20:03",
      "arrivalNextDay": false,
      "durationMin": 60,
      "recommendedStationArrivalBy": "18:43",
      "note": "提前通關且能預留進站時間才考慮"
    },
    {
      "id": "local-1954",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "19:54",
      "arriveKanazawa": "20:50",
      "arrivalNextDay": false,
      "durationMin": 56,
      "recommendedStationArrivalBy": "19:34",
      "note": "首選班次"
    },
    {
      "id": "local-2034",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "20:34",
      "arriveKanazawa": "21:31",
      "arrivalNextDay": false,
      "durationMin": 57,
      "recommendedStationArrivalBy": "20:14",
      "note": "第一備案"
    },
    {
      "id": "local-2055",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "20:55",
      "arriveKanazawa": "21:55",
      "arrivalNextDay": false,
      "durationMin": 60,
      "recommendedStationArrivalBy": "20:35",
      "note": "第二備案"
    },
    {
      "id": "local-2147",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "21:47",
      "arriveKanazawa": "22:44",
      "arrivalNextDay": false,
      "durationMin": 57,
      "recommendedStationArrivalBy": "21:27",
      "note": "延誤備案"
    },
    {
      "id": "local-2232",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "22:32",
      "arriveKanazawa": "23:30",
      "arrivalNextDay": false,
      "durationMin": 58,
      "recommendedStationArrivalBy": "22:12",
      "note": "深夜備案"
    },
    {
      "id": "local-2334",
      "type": "local",
      "service": "普通電車（直達・免換車）",
      "departToyama": "23:34",
      "arriveKanazawa": "00:31",
      "arrivalNextDay": true,
      "durationMin": 57,
      "recommendedStationArrivalBy": "23:14",
      "note": "當日末班車，抵達金澤為12/4凌晨"
    }
  ],
  "trainPriceEstimates": {
    "currency": "JPY",
    "localFamilyTotalApprox": 3230,
    "localAdult": 1290,
    "localChildAge7Approx": 650,
    "childAge3Approx": 0,
    "explanation": "普通電車估算2成人、7歲兒童1人、3歲幼兒隨行不另佔位；全家共約¥3,230，票價以當天購票為準"
  },
  "trainDecisionGuide": [
    {
      "stationArrival": "18:43前",
      "suggestion": "可評估19:03普通電車，但需確定有至少20分鐘購票和找電梯時間；否則搭19:54",
      "caution": "早班不值得拖四箱硬趕"
    },
    {
      "stationArrival": "18:44～19:34",
      "suggestion": "19:54普通電車 → 20:50金澤（首選）",
      "caution": "如時間不足20分鐘，改搭20:34"
    },
    {
      "stationArrival": "19:35～20:14",
      "suggestion": "20:34普通電車 → 21:31金澤",
      "caution": "注意孩子晚間休息時間"
    },
    {
      "stationArrival": "20:15～20:35",
      "suggestion": "20:55普通電車 → 21:55金澤",
      "caution": "需有20分鐘進站緩衝"
    },
    {
      "stationArrival": "20:36～21:27",
      "suggestion": "21:47普通電車 → 22:44金澤",
      "caution": "通知INOVA可能延後入住"
    },
    {
      "stationArrival": "21:28～22:12",
      "suggestion": "22:32普通電車 → 23:30金澤",
      "caution": "金澤站後段交通需準備"
    },
    {
      "stationArrival": "22:13～23:14",
      "suggestion": "23:34末班普通電車 → 隔日00:31金澤",
      "caution": "若太晚須跟INOVA確認深夜入住"
    },
    {
      "stationArrival": "23:15後",
      "suggestion": "當日普通電車可能趕不上末班車；優先確認列車實際狀況、聯絡飯店並安排富山當地住宿或其他安全交通",
      "caution": "不要假設過午夜仍有普通電車"
    }
  ],
  "luggage": {
    "policy": "普通電車須遵守營運商隨身行李規定；四件行李應由成人看管且不可堵住走道、車門；大型行李裝載需以現場及業者規定為準。",
    "warnings": [
      "普通電車通常沒有大型專用行李艙；不得堵住通道和車門",
      "富山站與金澤站有電梯，但仍可能繞路或遇檢修",
      "富山機場免費巴士4件行李的裝載條件尚待業者確認",
      "富山與金澤一般計程車都未必放得下4個大型箱，應明確提出車型要求"
    ]
  },
  "contacts": [
    {
      "label": "富山交通24小時派車",
      "phoneInternational": "+81-76-421-1122",
      "phoneDomestic": "076-421-1122",
      "url": "https://www.tomitaku.co.jp/taxi/"
    },
    {
      "label": "INOVA Kanazawa",
      "phoneInternational": "+81-76-223-3133",
      "email": "inova@linnas-design.com",
      "addressJP": "〒920-0036 石川県金沢市元菊町25-3"
    }
  ],
  "phrasesJapanese": {
    "freeBus": "台北便の無料直行バスはどこですか？ スーツケースが4個あります。",
    "taxi": "大人2人、子ども2人、スーツケース4個です。富山駅まで行きたいです。大きい車を呼べますか？",
    "hotelTaxi": "石川県金沢市元菊町25-3のINOVA Kanazawaまでお願いします。",
    "elevator": "金沢方面のホームへ行くエレベーターはどこですか？"
  },
  "preDepartureChecklist": [
    {
      "id": "bus-time",
      "text": "向華航／富山機場確認12/3免費接駁車實際發車時間及四件行李可否裝載",
      "done": false
    },
    {
      "id": "hotel",
      "text": "預先向INOVA確認晚間自助入住方式，保存密碼／指示",
      "done": false
    },
    {
      "id": "taxi",
      "text": "事先詢問富山交通大型車能否臨時派遣及四件行李乘載規格",
      "done": false
    },
    {
      "id": "rail",
      "text": "出發前重新確認12/3當天普通電車時刻（含臨時停駛）",
      "done": false
    },
    {
      "id": "bag-size",
      "text": "記下四個行李箱尺寸，必要時提供車行",
      "done": false
    },
    {
      "id": "hotel-address",
      "text": "下載離線地圖，保存INOVA日文地址與電話",
      "done": false
    }
  ],
  "operationalNotes": [
    "所有時間以日本當地時間表示，比台灣快1小時",
    "免費接駁車12/3實際發車時刻尚待確認；有班表不代表車票已預訂",
    "全家有四件行李與兩個孩子，建議從抵達富山站到發車至少預留20分鐘",
    "直達普通電車末班車為富山23:34，金澤隔日00:31（依目前時刻表）",
    "列車臨時改點、月台更動或因風雪停駛，請以當天官方公告為準",
    "務必在出發前完成INOVA 17:00以後的自助入住安排"
  ],
  "lastUpdated": "2026-11-10",
  "sourceUrls": {
    "chinaAirlinesWinter": "https://www.pref.toyama.jp/8002/kouhou/202609071.html",
    "freeShuttle": "https://www.toyama-airport.jp/corp/news/8262",
    "airportTaxi": "https://www.toyama-airport.co.jp/access/taxi",
    "taxi24Hours": "https://www.tomitaku.co.jp/company/",
    "localTimetable": "https://www.jorudan.co.jp/time/to/%E5%AF%8C%E5%B1%B1_%E9%87%91%E6%B2%A2/?r=%E3%81%82%E3%81%84%E3%81%AE%E9%A2%A8%E3%81%A8%E3%82%84%E3%81%BE%E9%89%84%E9%81%93&tor=%EF%BC%A9%EF%BC%B2%E3%81%84%E3%81%97%E3%81%8B%E3%82%8F%E9%89%84%E9%81%93",
    "toyamaStationMap": "https://eki.jr-odekake.net/premises?id=0541465",
    "kanazawaStationElevator": "https://www.ishikawa-railway.jp/station/kanazawa/",
    "luggageLocal": "https://ainokaze.co.jp/ticket/type",
    "hotelGuide": "https://kanazawahotel.jp/guide.html",
    "hotelAccess": "https://kanazawahotel.jp/access.html",
    "localTimetableOfficialPdf": "https://ainokaze.co.jp/wp-content/uploads/2026/03/32ab5cad00516bd1061d7ae353efb10f.pdf",
    "localTimetableOfficialStation": "https://ainokaze.co.jp/station/toyama",
    "localTimetableOfficialAnnouncement": "https://ainokaze.co.jp/22450",
    "localTrainRouteTimes": "https://www.jorudan.co.jp/time/to/%E5%AF%8C%E5%B1%B1_%E9%87%91%E6%B2%A2/?r=%E3%81%82%E3%81%84%E3%81%AE%E9%A2%A8%E3%81%A8%E3%82%84%E3%81%BE%E9%89%84%E9%81%93&tor=%EF%BC%A9%EF%BC%B2%E3%81%84%E3%81%97%E3%81%8B%E3%82%8F%E9%89%84%E9%81%93",
    "operatingStatus": "https://trafficinfo.ainokaze.co.jp/"
  },
  "timetableDetails": {
    "service": "あいの風とやま鉄道・IRいしかわ鉄道直通普通列車",
    "direction": "富山站 → 金澤站",
    "effective": "2026年3月14日改正，12/3當日仍需確認是否有臨時異動",
    "officialDeparturePdf": "https://ainokaze.co.jp/wp-content/uploads/2026/03/32ab5cad00516bd1061d7ae353efb10f.pdf",
    "arrivalReference": "https://www.jorudan.co.jp/time/to/%E5%AF%8C%E5%B1%B1_%E9%87%91%E6%B2%A2/?r=%E3%81%82%E3%81%84%E3%81%AE%E9%A2%A8%E3%81%A8%E3%82%84%E3%81%BE%E9%89%84%E9%81%93&tor=%EF%BC%A9%EF%BC%B2%E3%81%84%E3%81%97%E3%81%8B%E3%82%8F%E9%89%84%E9%81%93",
    "stationPreparationBufferMin": 20,
    "lastTrainDepartsToyama": "23:34",
    "lastTrainArrivesKanazawa": "00:31 (+1日)"
  },
  "verification": {
    "checkedAt": "2026-11-10",
    "summary": "免費巴士、官方發車表與飯店聯絡資訊已核對；到達時刻、票價、計程車估價與12/3實際營運仍需當天查詢。",
    "hotelPhoneHours": "飯店電話受理 09:00–17:00；17:00 後入住須事前聯絡。"
  }
};
