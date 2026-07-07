import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layout/DashboardLayout";
import Navbar from "../components/Navbar";

import {
  Settings as SettingsIcon,
  User,
  Mail,
  Phone,
  Palette,
  Shield,
  Camera,
  Save,
  BarChart3,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";

import StatCard from "../components/ui/StatCard";

import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  logoutAllDevices,
  deleteAccount,
} from "../services/settingsService";

export default function Settings() {

  const [profile, setProfile] = useState({
    name: "Prajal Patel",
    email: "prajal@example.com",
    phone: "+91 9876543210",
    bio: "Full Stack Developer",
    timezone: "Asia/Kolkata",
    language: "English",
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    emailNotifications: true,
    pushNotifications: true,
    taskReminder: true,
    calendarSync: false,
    accentColor: "cyan",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  try {

    const user = await getProfile();

    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
      language: user.language || "English",
      timezone: user.timezone || "Asia/Kolkata",
    });

    setPreferences(
      user.preferences || {}
    );

  } catch (error) {
    console.error(error);
  }
};
  const handleProfileChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]: e.target.value,

    });

  };

  const handlePreference = (field) => {

    setPreferences({

      ...preferences,

      [field]: !preferences[field],

    });

  };

  const handlePassword = (e) => {

    setPassword({

      ...password,

      [e.target.name]: e.target.value,

    });

  };

  const saveSettings = async () => {
  try {

    await updateProfile(profile);

    await updatePreferences(preferences);

    alert("Settings saved successfully!");

  } catch (error) {

    console.error(error);

    alert("Failed to save settings.");

  }
};

  return (

    <DashboardLayout>

      <Navbar />

      <div className="p-8">

        {/* ================= HERO ================= */}

        <div
          className="
relative
overflow-hidden
bg-gradient-to-r
from-slate-900
via-slate-900
to-slate-800
border
border-slate-800
rounded-3xl
p-10
mb-8
"
        >

          <div
            className="
absolute
top-0
right-0
w-72
h-72
rounded-full
bg-cyan-500/10
blur-3xl
"
          />

          <div className="relative flex flex-wrap justify-between items-center gap-8">

            <div className="flex items-center gap-6">

              <div
                className="
relative
h-24
w-24
rounded-full
bg-gradient-to-br
from-cyan-500
to-blue-600
flex
items-center
justify-center
shadow-xl
shadow-cyan-500/20
"
              >

                <User size={42} />

                <button
                  className="
absolute
-bottom-1
-right-1
bg-slate-900
rounded-full
p-2
border
border-slate-700
hover:border-cyan-500
transition
"
                >

                  <Camera size={15} />

                </button>

              </div>

              <div>

                <p className="text-cyan-400 font-semibold">

                  Workspace Settings

                </p>

                <h1 className="text-5xl font-black mt-2">

                  Settings

                </h1>

                <p className="text-slate-400 mt-3 max-w-xl">

                  Manage your profile, workspace preferences,
                  security and notifications from one place.

                </p>

              </div>

            </div>

            <button
              onClick={saveSettings}
              className="
flex
items-center
gap-3
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:opacity-90
px-6
py-3
rounded-2xl
font-semibold
shadow-xl
shadow-cyan-500/20
transition
"
            >

              <Save size={18} />

              Save Changes

            </button>

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          <StatCard
            title="Projects"
            value="12"
            icon={<FolderKanban size={30} />}
            color="text-cyan-400"
          />

          <StatCard
            title="Completed Tasks"
            value="187"
            icon={<CheckCircle2 size={30} />}
            color="text-green-400"
          />

          <StatCard
            title="Productivity"
            value="92%"
            icon={<BarChart3 size={30} />}
            color="text-purple-400"
          />

        </div>

        {/* ================= PROFILE ================= */}

        <div
          className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
mb-8
"
        >

          <div className="flex items-center gap-3 mb-8">

            <div
              className="
h-12
w-12
rounded-2xl
bg-cyan-500/10
flex
items-center
justify-center
"
            >

              <User
                size={22}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold">

                Profile Information

              </h2>

              <p className="text-slate-400">

                Update your personal information

              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
pl-12
pr-4
py-3
outline-none
focus:border-cyan-500
transition
"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
pl-12
pr-4
py-3
outline-none
focus:border-cyan-500
transition
"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
pl-12
pr-4
py-3
outline-none
focus:border-cyan-500
transition
"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Language
              </label>

              <select
                name="language"
                value={profile.language}
                onChange={handleProfileChange}
                className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
px-4
py-3
outline-none
focus:border-cyan-500
transition
"
              >

                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>

              </select>

            </div>

            <div className="md:col-span-2">

              <label className="block text-sm text-slate-400 mb-2">
                Bio
              </label>

              <textarea
                rows={4}
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
px-4
py-3
outline-none
focus:border-cyan-500
transition
resize-none
"
              />

            </div>

          </div>

        </div>

        {/* ================= WORKSPACE ================= */}

        <div
          className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
mb-8
"
        >

          <div className="flex items-center gap-3 mb-8">

            <div
              className="
h-12
w-12
rounded-2xl
bg-cyan-500/10
flex
items-center
justify-center
"
            >

              <Palette
                size={22}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Workspace Preferences
              </h2>

              <p className="text-slate-400">
                Customize your workspace experience
              </p>

            </div>

          </div>

          <div className="space-y-5">

            {[
              ["Dark Mode", "darkMode"],
              ["Email Notifications", "emailNotifications"],
              ["Push Notifications", "pushNotifications"],
              ["Task Reminder", "taskReminder"],
              ["Calendar Sync", "calendarSync"],
            ].map(([label, key]) => (

              <div
                key={key}
                className="
flex
justify-between
items-center
bg-slate-800
rounded-2xl
p-5
"
              >

                <div>

                  <h3 className="font-semibold">
                    {label}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Enable or disable {label.toLowerCase()}
                  </p>

                </div>

                <button
                  onClick={() => handlePreference(key)}
                  className={`
w-14
h-8
rounded-full
transition-all
relative
${preferences[key]
                      ? "bg-cyan-500"
                      : "bg-slate-700"}
`}
                >

                  <div
                    className={`
absolute
top-1
h-6
w-6
rounded-full
bg-white
transition-all
${preferences[key]
                        ? "left-7"
                        : "left-1"}
`}
                  />

                </button>

              </div>

            ))}
          </div>

        </div>

        {/* ================= SECURITY ================= */}

        <div
          className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
mb-8
"
        >

          <div className="flex items-center gap-3 mb-8">

            <div
              className="
h-12
w-12
rounded-2xl
bg-red-500/10
flex
items-center
justify-center
"
            >

              <Shield
                size={22}
                className="text-red-400"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Security
              </h2>

              <p className="text-slate-400">
                Update your account password
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Current Password
              </label>

              <input
                type="password"
                name="current"
                value={password.current}
                onChange={handlePassword}
                placeholder="••••••••"
                className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
px-4
py-3
outline-none
focus:border-cyan-500
transition
"
              />

            </div>

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePassword}
                placeholder="••••••••"
                className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
px-4
py-3
outline-none
focus:border-cyan-500
transition
"
              />

            </div>

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirm"
                value={password.confirm}
                onChange={handlePassword}
                placeholder="••••••••"
                className="
w-full
bg-slate-800
border
border-slate-700
rounded-2xl
px-4
py-3
outline-none
focus:border-cyan-500
transition
"
              />

            </div>

          </div>

          <div className="mt-8">

            <div className="flex justify-between mb-2">

              <span className="text-sm text-slate-400">
                Password Strength
              </span>

              <span className="text-green-400 font-semibold">
                Strong
              </span>

            </div>

            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="
h-full
w-4/5
bg-gradient-to-r
from-green-500
to-cyan-500
rounded-full
"
              />

            </div>

          </div>

          <div className="mt-8 flex justify-end">

            <button
onClick={async () => {

  try {

    await changePassword({

      currentPassword:
        password.current,

      newPassword:
        password.newPassword,

      confirmPassword:
        password.confirm,

    });

    alert("Password Updated");

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Password update failed"
    );

  }

}}
className="
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:opacity-90
px-6
py-3
rounded-2xl
font-semibold
transition
"
>

Update Password

</button>

          </div>

        </div>

        {/* ================= DANGER ZONE ================= */}

        <div
          className="
bg-slate-900
border
border-red-500/30
rounded-3xl
p-8
mb-8
"
        >

          <div className="flex items-center gap-3 mb-6">

            <div
              className="
h-12
w-12
rounded-2xl
bg-red-500/10
flex
items-center
justify-center
"
            >

              <SettingsIcon
                size={22}
                className="text-red-400"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-red-400">
                Danger Zone
              </h2>

              <p className="text-slate-400">
                Permanent account actions
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-4">

           <button
onClick={async () => {

  const confirmDelete =
    window.confirm(
      "Delete your account?"
    );

  if (!confirmDelete) return;

  try {

    await deleteAccount();

    localStorage.clear();

    window.location.href =
      "/login";

  } catch (error) {

    alert("Delete failed");

  }

}}
className="
bg-red-600
hover:bg-red-700
px-6
py-3
rounded-2xl
font-semibold
transition
"
>

Delete Account

</button>

            <button
onClick={async () => {

  try {

    await logoutAllDevices();

    localStorage.clear();

    window.location.href =
      "/login";

  } catch (error) {

    alert("Logout failed");

  }

}}
className="
bg-slate-800
hover:bg-slate-700
px-6
py-3
rounded-2xl
font-semibold
transition
"
>

Logout All Devices

</button>

          </div>

        </div>
        {/* ================= FOOTER ACTIONS ================= */}

        <div
          className="
sticky
bottom-6
z-20
flex
justify-end
"
        >

          <div
            className="
bg-slate-900/90
backdrop-blur-xl
border
border-slate-800
rounded-2xl
px-6
py-4
shadow-2xl
flex
items-center
gap-4
"
          >

            <p className="text-slate-400 hidden md:block">
              You have unsaved changes.
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
px-5
py-3
rounded-xl
bg-slate-800
hover:bg-slate-700
transition
font-medium
"
            >

              Reset

            </button>

            <button
              onClick={saveSettings}
              className="
flex
items-center
gap-2
px-6
py-3
rounded-xl
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:opacity-90
transition
font-semibold
shadow-lg
shadow-cyan-500/20
"
            >

              <Save size={18} />

              Save Changes

            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}
