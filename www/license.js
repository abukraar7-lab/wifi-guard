// WiFi Guard - License Guard v2
const LicenseGuard = (function(){
  const STORAGE_KEY = "wg_license_v2";
  async function getDeviceId(){
    try{
      if(window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Device){
        const info = await window.Capacitor.Plugins.Device.getId();
        return info.identifier;
      }
    }catch(e){}
    let id = localStorage.getItem("wg_device_id");
    if(!id){ id = "web-" + Math.random().toString(36).slice(2,11); localStorage.setItem("wg_device_id", id); }
    return id;
  }
  async function validateCodeOnline(code, deviceId){
    return {ok:true};
  }
  async function init(){
    const gate = document.getElementById("license-gate");
    if(!gate) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved){ gate.remove(); return; }
    const res = await fetch("activate.html");
    gate.innerHTML = await res.text();
    gate.querySelector("#wg_activate_btn").onclick = async ()=>{
      const code = gate.querySelector("#wg_code").value.trim();
      const msg = gate.querySelector("#wg_msg");
      if(!code){ msg.textContent = "دخل الكود"; return; }
      msg.textContent = "جاري التحقق...";
      const deviceId = await getDeviceId();
      const r = await validateCodeOnline(code, deviceId);
      if(r.ok){
        localStorage.setItem(STORAGE_KEY, JSON.stringify({code, deviceId, t:Date.now()}));
        location.reload();
      } else {
        msg.textContent = r.msg || "فشل التفعيل";
      }
    };
  }
  return {init};
})();
