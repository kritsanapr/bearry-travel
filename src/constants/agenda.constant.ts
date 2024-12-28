export const AGENDA = {
  'Tokyo Trip 2025': {
    '14 อ.': {
      title: 'นัดรวมตัวที่สนามบินสุวรรณภูมิ เวลา 18.00น.',
      events: [
        { time: '21.00 น.', description: 'Check-in counter' },
        {
          time: '00.15 น.',
          description: 'Take off (เตรียมน้ำดื่มและอาหารไว้เผื่อหิวกลางคืน)',
        },
      ],
    },
    '15 พ.': {
      title: 'Landing',
      events: [
        { time: '08.00น.', description: 'Landing' },
        {
          description:
            'ผ่านด่าน Immigration และรับกระเป๋า (เตรียมชุดกันหนาวใส่กระเป๋าที่หยิบออกง่าย อากาศ 2-8°C ใส่ฮีทเทคด้วย)',
        },
        {
          description: 'เดินทางไปขึ้นรถไฟไปรับรถเช่า',
          notes: 'ทุกคนต้องซื้อบัตร Suica เพื่อใช้จ่ายค่ารถไฟ (จ่ายแยก)',
        },
        {
          time: '12.00น.',
          description: 'ตรวจเช็ครถและเดินทางไป',
          destination: 'วัดนาริตะซัง (Narita Temple)',
        },
        {
          time: '13.00น.',
          description: 'เดินทางไป ฟูจิ (Fujikawaguchiko)',
          notes: 'ระยะทาง 180 กม. ใช้เวลาเดินทาง 3-4 ชม.',
        },
        {
          time: '16.00น.',
          description: 'ถึง หมู่บ้านน้ำใส (Oshino Hakkai) เดินเล่นประมาณ 1 ชม.',
        },
        { time: '17.00น.', description: 'ชมพระอาทิตย์ตกที่ Lake Yamanaka' },
        {
          time: '17.30น.',
          description: 'เข้าเช็คอินโรงแรม Toyoko Inn Kawaguchiko',
        },
        {
          time: '19.00น.',
          description: 'รับประทานอาหารเย็นตามอัธยาศัย',
          recommendations: [
            'Lawson',
            'Kawaguchiko Station',
            'Lake Kawaguchiko',
          ],
        },
      ],
      notes: 'พักที่ฟูจิ 1 คืน',
    },
    '16 พฤ.': {
      events: [
        {
          time: '06.00น.',
          description: 'พบกันที่ล็อบบี้สำหรับถ่ายรูปถนนเมืองเก่า',
        },
        { time: '07.00น.', description: 'รับประทานอาหารเช้าที่โรงแรม' },
        {
          time: '08.00น.',
          description: 'ออกเดินทางเที่ยวในเมืองฟูจิ',
          destinations: [
            'Chureito Pagoda',
            'Tenku no Tori',
            'Oishi Park',
            'Fuji Ten',
          ],
        },
        { description: 'รับประทานอาหารเที่ยงที่ Kawaguchiko' },
        { time: '13.00น.', description: 'คืนรถเช่า' },
        {
          time: '14.00น.',
          description:
            'ขึ้นรถไฟกลับ Tokyo (ใช้ JR รอบที่ 1 ใช้เวลาเดินทาง 1.5 ชม.)',
        },
        {
          time: '15.30น.',
          description: 'เช็คอินโรงแรม Sotetsu Fresa Inn Tokyo-Kyobashi',
        },
        {
          description:
            'ช่วงเย็นเดินเที่ยวรอบโรงแรมหรือไป Tokyo Sky Tree (ค่าเข้า 600 บาท เดินทางโดย Suica)',
        },
      ],
    },
    '17 ศ.': {
      events: [
        {
          time: '08.00น.',
          description: 'พร้อมกันที่ล็อบบี้ (โรงแรมไม่มีอาหารเช้า)',
        },
        {
          time: '09.00น.',
          description:
            'เดินทางไป Gala Yuzawa (ใช้ JR *2 ใช้เวลาเดินทาง 1.45 ชม.)',
        },
        {
          time: '11.45น.',
          description: 'ถึง Gala Yuzawa และรอรถบัสโรงแรมมารับ',
        },
        { description: 'รับประทานอาหารเที่ยงที่โรงแรม' },
        { description: 'ช่วงบ่ายขึ้นกระเช้า (ค่ากระเช้า 1,600¥ ไม่รวมชุดสกี)' },
      ],
      notes: 'Gala Yuzawa สกีรีสอร์ท',
      details: {
        liftTicket: '6,500¥',
        snowmobile: '1,000¥',
        moonBike: '2,000¥',
        equipmentRental: '5,000¥',
        skiSuit: '6,000¥',
      },
    },
    '18 อา.': {
      events: [
        {
          time: '10.00น.',
          description: 'เดินทางกลับ Tokyo (ใช้ JR *3 ใช้เวลาเดินทาง 2 ชม.)',
        },
        {
          time: '14.00น.',
          description: 'ไป Ueno Zoo (มีค่าเข้า) หรือเดินเล่นที่ Ameyoko Market',
        },
        {
          description:
            'ช่วงเย็นไป Shibuya หรือ Shinjuku และรับประทานอาหารเย็นตามอัธยาศัย',
        },
      ],
    },
    '19 จ.': {
      events: [
        { time: '08.00น.', description: 'เที่ยว วัดอาซากุสะ (Sensoji Temple)' },
        { description: 'ช่วงบ่ายไป เกาะโอไดบะ หรือ Tokyo Tower' },
        { description: 'พักผ่อนตามอัธยาศัย' },
      ],
    },
    '20 อ.': {
      events: [
        {
          description: 'ทั้งวัน: เที่ยว Disneyland',
          notes: 'อยู่ตั้งแต่เช้าจนมืด รอดูพลุ',
        },
        { time: '22.00น.', description: 'กลับโรงแรม' },
      ],
    },
    '21 พ.': {
      events: [
        { time: '06.00น.', description: 'ไปตลาดปลา' },
        { description: 'ช่วงบ่ายเดินซื้อของฝากที่ Shinjuku' },
      ],
    },
    '22 พฤ.': {
      events: [
        { time: '08.00น.', description: 'ออกเดินทางไปสนามบิน' },
        { description: 'เดินทางกลับประเทศไทย 🎉' },
      ],
    },
  },
};
