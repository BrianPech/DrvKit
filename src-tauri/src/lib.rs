use std::sync::Mutex;
use sysinfo::{Disks, Networks, System};
use tauri::State;

struct AppState {
    sys: Mutex<System>,
    networks: Mutex<Networks>,
}

#[derive(serde::Serialize)]
struct DiskInfo {
    name: String,
    mount_point: String,
    total_space: u64,
    available_space: u64,
    file_system: String,
}

#[derive(serde::Serialize)]
struct NetworkInfo {
    name: String,
    received: u64,
    transmitted: u64,
    total_received: u64,
    total_transmitted: u64,
    mac_address: String,
    ip_addresses: Vec<String>,
}

#[derive(serde::Serialize)]
struct SystemStats {
    os_name: String,
    kernel_version: String,
    cpu_brand: String,
    core_count: usize,
    cpu_frequency: u64,   // Added
    architecture: String, // Added
    host_name: String,    // Added
    uptime: u64,          // Added
    memory_total: u64,
    memory_used: u64,
    gpu_name: String,
    disks: Vec<DiskInfo>,
    networks: Vec<NetworkInfo>,
}

#[tauri::command]
fn get_system_stats(state: State<AppState>) -> SystemStats {
    let mut sys = state.sys.lock().unwrap();
    let mut networks = state.networks.lock().unwrap();

    sys.refresh_all();
    networks.refresh(); // Update stats

    let os_name = System::name().unwrap_or_else(|| "Unknown".to_string());
    let kernel_version = System::kernel_version().unwrap_or_else(|| "Unknown".to_string());
    let host_name = System::host_name().unwrap_or_else(|| "Unknown".to_string());
    let uptime = System::uptime();
    let architecture = std::env::consts::ARCH.to_string();

    let cpu = sys.cpus().first();
    let cpu_brand = cpu
        .map(|c| c.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());
    let cpu_frequency = cpu.map(|c| c.frequency()).unwrap_or(0);
    let core_count = sys.physical_core_count().unwrap_or(0);

    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();

    let gpu_name = get_gpu_info();

    let disks = Disks::new_with_refreshed_list();
    let disk_info = disks
        .list()
        .iter()
        .map(|disk| DiskInfo {
            name: disk.name().to_string_lossy().to_string(),
            mount_point: disk.mount_point().to_string_lossy().to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
            file_system: disk.file_system().to_string_lossy().to_string(),
        })
        .collect();

    let network_info = networks
        .list()
        .iter()
        .map(|(name, data)| NetworkInfo {
            name: name.clone(),
            received: data.received(),
            transmitted: data.transmitted(),
            total_received: data.total_received(),
            total_transmitted: data.total_transmitted(),
            mac_address: data.mac_address().to_string(),
            ip_addresses: Vec::new(), // ip_networks() disabled due to sysinfo compatibility
        })
        .collect();

    SystemStats {
        os_name,
        kernel_version,
        cpu_brand,
        core_count,
        cpu_frequency,
        architecture,
        host_name,
        uptime,
        memory_total,
        memory_used,
        gpu_name,
        disks: disk_info,
        networks: network_info,
    }
}

fn get_gpu_info() -> String {
    // Try executing lspci -mm to get machine readable output
    // Format: Slot "Class" "Vendor" "Device" ...
    if let Ok(output) = std::process::Command::new("lspci").arg("-mm").output() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        for line in stdout.lines() {
            // Check for graphics related classes
            if line.contains("VGA compatible controller")
                || line.contains("3D controller")
                || line.contains("Display controller")
            {
                // Parse the line manually or somewhat loosely
                // Example: 00:02.0 "VGA compatible controller" "Intel Corporation" "HD Graphics 620" ...
                let parts: Vec<&str> = line.split('"').collect();
                if parts.len() >= 6 {
                    let vendor = parts[3];
                    let model = parts[5];
                    return format!("{} {}", vendor, model);
                }
            }
        }
    }

    "Unknown / Integrated".to_string()
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            sys: Mutex::new(System::new_all()),
            networks: Mutex::new(Networks::new_with_refreshed_list()),
        })
        .invoke_handler(tauri::generate_handler![greet, get_system_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
