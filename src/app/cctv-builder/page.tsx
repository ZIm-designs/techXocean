'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useBuilderStorage } from '@/hooks/useBuilderStorage';
import { CartContext } from '@/components/ClientApplication';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';

const getIconComponent = (iconName: string) => {
    if (!iconName) return FaIcons.FaBox;
    if (iconName.startsWith('Gi')) return (GiIcons as any)[iconName] || FaIcons.FaBox;
    return (FaIcons as any)[iconName] || FaIcons.FaBox;
};

const MOCK_CCTV_COMPONENTS = {
    cameraType: [
        { id: 'cctv_cam_1', title: 'Dahua HAC-B1A21P 2MP Bullet Camera',         specs: '2MP | HDCVI | IR 20m | IP67 | Bullet Type',          price: 1800,  wattage: 5 },
        { id: 'cctv_cam_2', title: 'Hikvision DS-2CE56D0T-IRPF 2MP Dome Camera', specs: '2MP | HDTVI | IR 20m | IP66 | Dome Type',            price: 1600,  wattage: 4 },
        { id: 'cctv_cam_3', title: 'Dahua SD22204UE-GN 2MP PTZ Camera',          specs: '2MP | IP | 4x Optical Zoom | Pan/Tilt/Zoom',         price: 15500, wattage: 12 },
    ],
    recorder: [
        { id: 'cctv_rec_1', title: 'Dahua XVR1B04-I 4 Channel DVR',              specs: '4 Channel | 5-in-1 | H.265+ | 1x SATA | 1080P',     price: 3500,  wattage: 15 },
        { id: 'cctv_rec_2', title: 'Hikvision DS-7108HGHI-F1 8 Channel DVR',     specs: '8 Channel | Turbo HD | H.265 | 1x SATA | 1080P',    price: 5500,  wattage: 20 },
        { id: 'cctv_rec_3', title: 'Dahua NVR4116HS-4KS2 16 Channel NVR',        specs: '16 Channel | H.265+ | 4K | 2x SATA | PoE-capable',  price: 12500, wattage: 25 },
    ],
    storage: [
        { id: 'cctv_st_1', title: 'WD Purple 1TB Surveillance HDD',              specs: '1TB | SATA 6Gb/s | 5400RPM | 64MB Cache | 24/7',    price: 5500,  wattage: 6 },
        { id: 'cctv_st_2', title: 'Seagate SkyHawk 2TB Surveillance HDD',        specs: '2TB | SATA 6Gb/s | 5900RPM | 256MB Cache | 24/7',   price: 7500,  wattage: 7 },
        { id: 'cctv_st_3', title: 'WD Purple 4TB Surveillance HDD',              specs: '4TB | SATA 6Gb/s | 5400RPM | 256MB Cache | 24/7',   price: 12000, wattage: 8 },
    ],
    powerSupply: [
        { id: 'cctv_ps_1', title: '12V 5A CCTV Power Supply Adapter',            specs: '12V DC | 5A | 60W | Single Output',                 price: 450,   wattage: 0 },
        { id: 'cctv_ps_2', title: '12V 10A 9 Channel Central Power Supply Box',  specs: '12V DC | 10A | 9 Channel | Metal Housing',          price: 1500,  wattage: 0 },
    ],
    monitor: [
        { id: 'cctv_mon_1', title: 'Samsung 22" Full HD CCTV Monitor',           specs: '22" | 1920x1080 | HDMI | VGA',                      price: 9500,  wattage: 25 },
        { id: 'cctv_mon_2', title: 'LG 24" Full HD Security Monitor',            specs: '24" | 1920x1080 | HDMI | DisplayPort',              price: 14000, wattage: 30 },
    ],
    installKit: [
        { id: 'cctv_kit_1', title: 'Basic CCTV Installation Kit',                specs: 'Wall Mounts, Screws, Cable Clips, Junction Box',     price: 800,   wattage: 0 },
        { id: 'cctv_kit_2', title: 'Professional Installation Kit',              specs: 'Heavy Duty Mounts, Conduit, Connectors, Tools',     price: 2000,  wattage: 0 },
    ],
};

const CCTV_CORE_CONFIG = [
    { key: 'cameraType',  label: 'Camera Type',        reactIcon: 'FaVideo',       required: true  },
    { key: 'recorder',    label: 'NVR / DVR Recorder', reactIcon: 'GiServerRack',  required: true  },
    { key: 'storage',     label: 'Surveillance HDD',   reactIcon: 'FaHdd',         required: true  },
    { key: 'powerSupply', label: 'Power Supply',       reactIcon: 'FaPlug',        required: true  },
];

const CCTV_OPTIONAL_CONFIG = [
    { key: 'monitor',    label: 'Monitor',          reactIcon: 'FaDesktop',     required: false },
    { key: 'installKit', label: 'Installation Kit', reactIcon: 'FaToolbox',     required: false },
];

const REQUIRED_KEYS = CCTV_CORE_CONFIG.filter(c => c.required).map(c => c.key);

export default function CCTVBuilderPage() {
    const { addToCart } = useContext(CartContext);
    const router = useRouter();
    const [selections, setSelections] = useBuilderStorage<Record<string, any>>('cctvBuilderState', {});
    const [cameraCount, setCameraCount] = useState(4);
    const [peripheralsOpen, setPeripheralsOpen] = useState(false);

    const totalPrice = Object.entries(selections).reduce((sum: number, [key, item]: [string, any]) => {
        if (!item) return sum;
        return sum + item.price * (key === 'cameraType' ? cameraCount : 1);
    }, 0) as number;

    const selectedRequired = REQUIRED_KEYS.filter(k => !!selections[k]).length;
    const selectedOptionalCount = CCTV_OPTIONAL_CONFIG.filter(p => !!selections[p.key]).length;

    const handleRemove = (key: string) => {
        const n = { ...selections };
        delete n[key];
        setSelections(n);
    };

    const handleAddToCart = () => {
        Object.entries(selections).forEach(([key, item]: [string, any]) => {
            if (item) addToCart(item, key === 'cameraType' ? cameraCount : 1, false);
        });
        alert('CCTV System components added to cart!');
    };

    const renderRow = (config: any) => {
        const sel = selections[config.key];
        const multiplier = config.key === 'cameraType' ? cameraCount : 1;
        const finalPrice = sel ? sel.price * multiplier : 0;
        const Icon = getIconComponent(config.reactIcon);

        return (
            <div key={config.key} className="component-row-compact">
                {/* Icon */}
                <div className="crc-icon">
                    {Icon && <Icon color="#db4b27" size={22} />}
                </div>

                {/* Name + badge */}
                <div className="component-info-compact">
                    <span className="component-name-compact">{config.label}</span>
                    {config.required !== undefined && (
                        <span className={config.required ? 'req-badge' : 'opt-badge'}>
                            {config.required ? 'Required' : 'Optional'}
                        </span>
                    )}
                </div>

                {/* Selected product name */}
                <div className={`component-status-compact ${sel ? 'selected' : ''}`}>
                    {sel ? (
                        <>
                            {sel.title}
                            {multiplier > 1 && <span style={{ color: '#1B5B97', marginLeft: '6px', fontWeight: 600 }}>×{multiplier}</span>}
                        </>
                    ) : 'Choose a ' + config.label}
                </div>

                {/* Price */}
                <div className="component-price-compact">
                    {sel ? `৳${finalPrice.toLocaleString()}` : '—'}
                </div>

                {/* Button */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {sel && (
                        <button className="crc-remove-btn" title="Remove" onClick={() => handleRemove(config.key)}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                    <button
                        className={`choose-btn-compact ${sel ? 'selected' : ''}`}
                        onClick={() => router.push(`/cctv-builder/select/${config.key}`)}
                    >
                        {sel ? 'Change' : 'Choose'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="pc-builder-page">
            {/* Header */}
            <div className="builder-header-compact">
                <h1>CCTV Quotation</h1>
                <p className="subtitle">Build your custom surveillance solution and get an instant quote.</p>
            </div>

            {/* Camera count row */}
            <div className="core-components-container" style={{ marginBottom: '0', borderRadius: '12px 12px 0 0' }}>
                <div className="component-row-compact" style={{ background: '#f8faff' }}>
                    <div className="crc-icon">
                        <FaIcons.FaVideo color="#db4b27" size={22} />
                    </div>
                    <div className="component-info-compact">
                        <span className="component-name-compact">Number of Cameras</span>
                        <span className="req-badge">Configure</span>
                    </div>
                    <div className="component-status-compact selected">
                        Set how many cameras you need — price updates automatically
                    </div>
                    <div className="component-price-compact"></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => setCameraCount(c => Math.max(1, c - 1))}
                            style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #dde3ea', background: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#555' }}>−</button>
                        <span style={{ fontWeight: 800, fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>{cameraCount}</span>
                        <button onClick={() => setCameraCount(c => c + 1)}
                            style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #dde3ea', background: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#555' }}>+</button>
                    </div>
                </div>

                {/* Core CCTV components */}
                {CCTV_CORE_CONFIG.map(c => renderRow(c))}
            </div>

            {/* Optionals (collapsible) */}
            <div className="peripherals-section" style={{ marginTop: '0', borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                <div className="peripherals-header" onClick={() => setPeripheralsOpen(!peripheralsOpen)}>
                    <i className={`fas fa-chevron-${peripheralsOpen ? 'down' : 'right'}`}></i>
                    <span>Optional Add-ons</span>
                    <span className="peripherals-count">
                        {selectedOptionalCount} / {CCTV_OPTIONAL_CONFIG.length} selected
                    </span>
                </div>
                {peripheralsOpen && (
                    <div className="peripherals-list">
                        {CCTV_OPTIONAL_CONFIG.map(c => renderRow(c))}
                    </div>
                )}
            </div>

            {/* Sticky Summary Bar */}
            <div className="summary-bar-compact">
                <div className="summary-stats">
                    <div className="stat">
                        <span className="stat-label">Cameras:</span>
                        <span className="stat-value">{cameraCount}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Components:</span>
                        <span className="stat-value">{selectedRequired}/{REQUIRED_KEYS.length}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">৳{totalPrice.toLocaleString()}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="sr-btn-secondary" onClick={() => window.print()}>
                        <i className="fas fa-print"></i> Print Quote
                    </button>
                    <button
                        className="complete-build-btn"
                        onClick={handleAddToCart}
                        disabled={selectedRequired < 2}
                    >
                        <i className="fas fa-shopping-cart"></i> Add Quote to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
