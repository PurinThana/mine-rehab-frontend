# ศูนย์ข้อมูลการฟื้นฟูเหมือง — Landing Page

หน้า Landing page สำหรับเว็บไซต์ติดตามแผนฟื้นฟูพื้นที่เหมือง สร้างด้วย Vite + React + Tailwind CSS

## เริ่มใช้งาน

```bash
npm install
cp .env.example .env   # ตั้ง VITE_API_URL ให้ตรงกับ backend และ VITE_SITE_ID (ค่าเริ่มต้น 1)
npm run dev
```

เปิด http://localhost:5173

## Build สำหรับ production

```bash
npm run build
npm run preview
```

## โครงสร้างโปรเจกต์

```
src/
  App.jsx                 ประกอบทุก section
  index.css                Tailwind layers + base styles
  components/
    Navbar.jsx              เมนูนำทางแบบ sticky
    Hero.jsx                ส่วนหัว + ภาพประกอบระดับชั้น (BenchContours)
    BenchContours.jsx       ภาพประกอบ SVG มุมสูงของระดับชั้น (signature visual)
    ProgressRing.jsx        วงแหวนแสดงความคืบหน้า (ใช้ซ้ำหลายจุด)
    StatsOverview.jsx       แถบสรุปตัวเลขภาพรวม
    InfoStrip.jsx           ระยะเวลาดำเนินงาน + แผนตามฤดูกาล
    BenchSummary.jsx        ตาราง + แผนภาพระดับชั้น (Bench) ทั้ง 11 ระดับ
    FlowerTypes.jsx         ชนิดพืชคลุมดินที่ใช้ปลูก
    RecentActivities.jsx    กิจกรรมภาคสนามล่าสุด
    NewsDownloads.jsx       ข่าวสาร / เอกสารดาวน์โหลด / ติดต่อเรา
    Footer.jsx               ท้ายเว็บไซต์
    Icons.jsx                ชุดไอคอนเส้น (inline SVG ไม่พึ่งพา icon font)
    LoginModal.jsx          ฟอร์มเข้าสู่ระบบ (เปิดจากปุ่ม "สำหรับ กพร.")
    UserMenu.jsx            เมนูผู้ใช้ + ปุ่มออกจากระบบ (แสดงแทนปุ่มเข้าสู่ระบบ)
    SessionExpiredNotice.jsx แจ้งเตือนเมื่อ token หมดอายุ
  context/
    AuthContext.jsx         สถานะการล็อกอินของทั้งแอป (useAuth)
    SiteDataContext.jsx     ข้อมูลไซต์ชุดเดียวที่ทุก section ใช้ร่วมกัน (useSiteData)
  hooks/
    useCollection.js        โหลดข้อมูลหนึ่งชุด + สถานะ loading/error
  utils/date.js             วันที่ พ.ศ., ตัวเลขแบบไทย, ระยะเวลาโครงการ
  config.js                 SITE_ID ของไซต์ที่หน้า landing แสดง
  api/
    index.js                axios client + endpoint ทั้งหมด
```

## ระบบเข้าสู่ระบบ

ทุก component เรียก `useAuth()` จาก `context/AuthContext.jsx` ได้เลย:

```jsx
const { user, isAuthenticated, isAdmin, restoring, login, logout } = useAuth()

// ซ่อนปุ่มแก้ไขข้อมูลจากผู้เข้าชมทั่วไป
{isAuthenticated && <button onClick={save}>บันทึก</button>}
```

- **นโยบายเดียวกับ backend:** GET เปิดสาธารณะ — หน้าเว็บใช้งานได้ครบโดยไม่ต้องล็อกอิน การล็อกอินมีผลแค่ปลดล็อกการแก้ไขข้อมูล
- **เก็บ token ใน localStorage** (คีย์ `token`) — `src/api/index.js` แนบเป็น `Authorization: Bearer` ให้ทุก request อัตโนมัติ
- **กู้คืน session ตอนเปิดหน้าเว็บ** ด้วยการยิง `GET /auth/me` เพื่อยืนยันว่า token ยังใช้ได้จริง ไม่เชื่อค่าใน localStorage เพียวๆ ระหว่างรอใช้ `restoring` กัน Navbar กระพริบ
- **token หมดอายุ** จัดการสองทาง: ตั้ง timer จาก `expiresAt` ที่ backend ส่งมาพร้อม token และดัก 401 ใน response interceptor — ทั้งสองทางเคลียร์ session แล้วขึ้น `SessionExpiredNotice`
- 401 จาก `/auth/login` ถือเป็น "รหัสผ่านผิด" ไม่ใช่ session หมดอายุ — แสดง error ในฟอร์มโดยไม่เคลียร์อะไร

สร้างบัญชีสำหรับทดสอบจากฝั่ง backend:

```bash
npm run create-user -- --name="ผู้ดูแลระบบ" --email=admin@example.com --password="Str0ng!Pass123" --role=admin --site=1
```

## หน้าจัดการข้อมูล (แอดมิน)

เปิดที่ `#/admin` — เข้าถึงได้จากเมนูผู้ใช้บน Navbar หลังเข้าสู่ระบบ (“จัดการข้อมูลเว็บไซต์”)

```
src/
  hooks/
    useHashRoute.js      routing แบบ hash "#/admin/<section>" ไม่พึ่ง react-router
    useCollection.js     โหลด/รีโหลดข้อมูลหนึ่งชุด + สถานะ loading/error
    useCrud.js           กลไก เพิ่ม/แก้ไข/ลบ ที่ทุกหมวดใช้ร่วมกัน
  admin/
    AdminApp.jsx         ด่านตรวจสิทธิ์ + เมนู + ตัวเลือกไซต์
    ui/                  Field, Modal/FormModal/ConfirmDialog, Toast, Section/ตาราง,
                         FileUploadField (อัปโหลดรูป/PDF)
    sections/
      SiteSection.jsx          แก้ข้อมูลโครงการ + ดูตัวเลขภาพรวม (อ่านอย่างเดียว)
      BenchLevelsSection.jsx   ระดับชั้น: เพิ่ม/แก้ไข/ลบ + เปิดจัดการการปลูก
      PlantingsModal.jsx       จำนวนต้นแยกตามพันธุ์ของหนึ่งระดับชั้น
      SpeciesSection.jsx       พันธุ์พืช (ใช้ร่วมทุกไซต์)
      ActivitiesSection.jsx    กิจกรรมภาคสนาม
      NewsSection.jsx          ข่าวสาร
      DocumentsSection.jsx     เอกสารดาวน์โหลด (metadata)
      SnapshotsSection.jsx     บันทึก/ดูประวัติความคืบหน้า
```

**สิ่งที่ควรรู้:**

- **สิทธิ์ตรงกับ backend เป๊ะ** — เข้าหน้านี้ได้ทั้ง `admin` และ `staff` เพราะ backend ให้ทั้งสองบทบาทเขียนข้อมูลได้ ปุ่มที่ต้องเป็น `admin` (ลบระดับชั้น / ลบพันธุ์พืช) จะถูก disable พร้อมบอกเหตุผลเมื่อเข้าด้วยสิทธิ์ `staff` แทนที่จะปล่อยให้กดแล้วเจอ 403
- **ทุกหมวดยึด “ไซต์ที่กำลังจัดการ”** จากตัวเลือกด้านบน ค่าเริ่มต้นคือไซต์ที่ผู้ใช้สังกัด (`user.siteId`) ถ้าไม่ผูกไซต์จะใช้ไซต์แรก
- **`#/` เท่านั้นที่เป็น route** — anchor เดิมของหน้า landing (`#home`, `#bench`) จึงยังเลื่อนหน้าได้ตามปกติ ไม่ชนกัน
- **ตัวเลขภาพรวมแก้ตรงๆ ไม่ได้** เพราะคำนวณสดจาก view — แสดงไว้ในหมวด “ข้อมูลโครงการ” เพื่อให้เห็นผลของการแก้ระดับชั้น/การปลูกได้ทันที
- **เอกสารเก็บแค่ลิงก์ไฟล์** ตัวไฟล์อยู่บน Cloudinary (อัปโหลดได้จากในฟอร์ม) — การลบรายการลบแค่ข้อมูลในฐานข้อมูล ไฟล์บน Cloudinary ยังอยู่

## ส่วนที่ดึงข้อมูลจริงจากฐานข้อมูลแล้ว

ทุก section บนหน้า landing ดึงจากฐานข้อมูลแล้ว ไม่มีตัวเลข mock เหลืออยู่

| Section | Component | มาจาก |
|---|---|---|
| Hero (ช่วงระดับชั้น, % ความคืบหน้า) | `Hero.jsx` | `sites/:id` + `overview` + `bench-levels` + `species-totals` |
| ภาพรวมความก้าวหน้า | `StatsOverview.jsx` | `GET /sites/:id/overview` |
| ระยะเวลาดำเนินงาน | `InfoStrip.jsx` | `GET /sites/:id` (คำนวณ % จาก start/end date) |
| สรุปตามระดับชั้น | `BenchSummary.jsx` | `GET /sites/:id/bench-levels` |
| ชนิดพืชคลุมดิน | `FlowerTypes.jsx` | `GET /sites/:id/species-totals` |
| กิจกรรมล่าสุด | `RecentActivities.jsx` | `GET /sites/:id/activities?limit=5` |
| ข่าวสารและประกาศ | `NewsDownloads.jsx` | `GET /sites/:id/news?limit=3` |
| ดาวน์โหลดเอกสาร | `NewsDownloads.jsx` | `GET /sites/:id/documents` |

### SiteDataContext

ห้า section แรกใช้ข้อมูลชุดเดียวกันซ้ำๆ (overview ใช้ 2 ที่, bench-levels 2 ที่,
species-totals 3 ที่) ถ้าปล่อยให้แต่ละ component ยิงเองจะกลายเป็น ~13 คำขอต่อการเปิด
หน้าเดียว — `context/SiteDataContext.jsx` จึงโหลดทีเดียว 4 คำขอแบบขนานแล้วแชร์ผลให้ทุกตัว

```jsx
const { site, overview, benchLevels, speciesTotals, loading, error, reload } = useSiteData()
```

### สิ่งที่คำนวณสดจากข้อมูล ไม่ฝังเป็นค่าคงที่

- **วันที่ "ข้อมูล ณ วันที่ ..."** = วันนี้ เพราะตัวเลขภาพรวมคำนวณสดจาก view ทุกครั้งที่เรียก
- **ช่วงระดับชั้น** (`+210 ถึง +270`) หาจาก min/max ของ `elevation_m`
- **คำอธิบายใต้หัวข้อระดับชั้น** ตรวจว่าระยะห่างระหว่างชั้นเท่ากันไหม และพื้นที่เท่ากันไหม
  แล้วเลือกข้อความให้ตรงกับข้อมูลจริง (เดิม hardcode ว่า "เท่ากันที่ 489 ตร.ม." ซึ่งไม่จริงแล้ว)
- **ระยะเวลาโครงการ** `projectDuration()` ใน `utils/date.js` คำนวณ "รวมกี่ปี / ผ่านไปแล้วเท่าไร"
  และ % ของแถบ progress จาก `start_date`/`end_date` (รองรับกรณียังไม่เริ่มและจบแล้ว)

### สถานะไม่พร้อม

ทุก section มี loading skeleton (ขนาดเท่าของจริง กัน layout กระโดด), error พร้อมปุ่ม
"ลองอีกครั้ง" และ "ยังไม่มีข้อมูล" — ทดสอบด้วยการ build ชี้ API ไปพอร์ตที่ไม่มีอะไรฟัง
แล้วหน้าเว็บยังแสดงโครงและข้อความบอกสาเหตุ ไม่ขาว ไม่ crash

**ยังเป็นข้อความคงที่:** แผนช่วงหน้าร้อน/หน้าฝนใน `InfoStrip` และการ์ด "ติดต่อเรา"
ใน `NewsDownloads` — เป็นเนื้อหาเชิงบรรยายที่ไม่มีตารางรองรับ ถ้าต้องการให้แก้จาก
หน้าแอดมินต้องเพิ่มตารางใหม่ก่อน

## อัปโหลดรูปและ PDF

หน้าแอดมินอัปโหลดไฟล์ได้จากในฟอร์มเลย (`admin/ui/FileUploadField.jsx`) — เลือกไฟล์
จากเครื่อง ระบบส่งขึ้น `POST /uploads` ฝั่ง backend แล้วเก็บ URL ที่ได้ลงฐานข้อมูล

- **กิจกรรม / ข่าวสาร** — อัปโหลดรูป (ไม่ใส่ก็ได้)
- **เอกสาร** — อัปโหลด PDF และระบบจะเติมช่อง "ขนาดไฟล์" ให้เองจากไฟล์จริง
- ทุกช่องยังวาง URL เองได้ ถ้าไฟล์อยู่ที่อื่นแล้ว

ต้องตั้งค่า Cloudinary ฝั่ง backend ก่อน — ดูขั้นตอนใน README ของ backend
(มีข้อที่มักพลาด: บัญชีฟรีบล็อกการส่ง PDF ไว้ ต้องไปติ๊กเปิดใน Settings → Security)

## โทนสีและตัวอักษร (ปรับได้ใน `tailwind.config.js`)

- **forest** เขียวป่า/พืชคลุมดินที่ฟื้นแล้ว
- **clay** ดินที่ยังไม่ได้ปลูก / จุดเน้น
- **sand** พื้นหลังกระดาษอุ่น
- **soil** ตัวอักษรเนื้อหา
- **bloom** สถานะรอดำเนินการ
- ตัวอักษรหัวเรื่อง: Kanit, เนื้อหา: Sarabun, ตัวเลข: IBM Plex Mono
