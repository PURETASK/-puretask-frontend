# 🔗 Connect Frontend & Backend RIGHT NOW

## ✅ GOOD NEWS: They're Already Configured!

Your frontend and backend are **already set up** to work together on **port 4000**!

```
Frontend → http://localhost:3000
   ↓
Backend API → http://localhost:4000
   ↓
Neon Database
```

---

## 🚀 3 SIMPLE STEPS TO CONNECT

### **STEP 1: Start the Backend**

```powershell
cd C:\Users\onlyw\Documents\GitHub\puretask-backend
npm run dev
```

You should see:
```
✅ Server running on port 4000
✅ Database connected
```

---

### **STEP 2: Start the Frontend**

Open a **NEW** PowerShell window:

```powershell
cd C:\Users\onlyw\Documents\GitHub\puretask-frontend
npm run dev
```

You should see:
```
✅ Ready on http://localhost:3000
```

---

### **STEP 3: Test the Connection**

**Open your browser:** http://localhost:3000

**Try these:**

1. **Go to Register page:** http://localhost:3000/register
2. **Create a test account:**
   - Email: `test@example.com`
   - Password: `Test123!`
   - Role: Client
3. **Click "Register"**

**If it works, you'll:**
- ✅ See "Registration successful!" message
- ✅ Get redirected to dashboard
- ✅ See your user profile

---

## 🔍 TROUBLESHOOTING

### **Problem 1: Backend not connecting**

**Error:** `Failed to fetch` or `Network error`

**Check:**
```powershell
# Is the backend running?
Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
```

**Should return:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T..."
}
```

**Fix:** Make sure backend is running on port 4000

---

### **Problem 2: CORS Error**

**Error:** `Access-Control-Allow-Origin` error in browser console

**Check:** Open `puretask-backend/src/index.ts` and verify CORS is enabled:
```typescript
app.use(cors({
  origin: '*',  // Or 'http://localhost:3000'
  credentials: true
}));
```

**Fix:** Restart backend after checking

---

### **Problem 3: Port Already in Use**

**Error:** `Port 4000 is already in use`

**Option A: Kill the process**
```powershell
# Find what's using port 4000
netstat -ano | findstr :4000

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

**Option B: Change the port**

Create `puretask-backend/.env`:
```env
PORT=3001
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
# ... other required variables
```

Then update frontend:
Create `puretask-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📊 CONNECTION STATUS CHECKER

Want to verify everything is connected?

**1. Backend Status:**
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
```

**2. Frontend Status:**
Open browser: http://localhost:3000

**3. Full Integration Test:**

Open browser console (F12) and run:
```javascript
// Test backend connection
fetch('http://localhost:4000/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend:', data))
  .catch(err => console.error('❌ Backend:', err));

// Test auth endpoint
fetch('http://localhost:4000/auth/health')
  .then(r => r.json())
  .then(data => console.log('✅ Auth:', data))
  .catch(err => console.error('❌ Auth:', err));
```

---

## 🎯 WHAT TO TEST

Once connected, test these key features:

### **1. Authentication Flow**
- ✅ Register new user
- ✅ Login with credentials
- ✅ Logout
- ✅ Token persistence

### **2. Client Flow**
- ✅ Browse cleaners
- ✅ View cleaner profile
- ✅ Create booking
- ✅ View job details

### **3. Cleaner Flow**
- ✅ Register as cleaner
- ✅ View available jobs
- ✅ Accept a job
- ✅ Update job status

### **4. Real-time Features**
- ✅ Send message
- ✅ Receive message notification
- ✅ Job status updates

---

## 🌐 PRODUCTION DEPLOYMENT

When deploying to production:

### **1. Deploy Backend (Railway/Render)**
Get your backend URL: `https://puretask-backend.railway.app`

### **2. Update Backend Environment**
```env
FRONTEND_URL=https://puretask.vercel.app
NODE_ENV=production
```

### **3. Deploy Frontend (Vercel/Netlify)**
Set environment variable:
```env
NEXT_PUBLIC_API_URL=https://puretask-backend.railway.app
```

### **4. Test Production Connection**
Visit your deployed frontend and try registering/login!

---

## 💡 QUICK REFERENCE

| Item | Local Development | Production |
|------|------------------|------------|
| **Backend** | http://localhost:4000 | https://your-backend.railway.app |
| **Frontend** | http://localhost:3000 | https://your-app.vercel.app |
| **Database** | Neon (same for both) | Neon (same for both) |
| **CORS Origin** | `*` or `http://localhost:3000` | `https://your-app.vercel.app` |

---

## 🆘 NEED HELP?

If you're stuck, tell me:
1. Which step you're on
2. What error you see
3. What the console shows

I'll help you debug! 🚀

---

## ✅ CONNECTION CHECKLIST

Before moving to deployment, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Dashboard loads user data
- [ ] No CORS errors in console
- [ ] No network errors in DevTools
- [ ] JWT token is stored properly
- [ ] Protected routes work
- [ ] Can create/view data

**All checked?** You're ready to deploy! 🎉

