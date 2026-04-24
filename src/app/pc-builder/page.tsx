'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useBuilderStorage } from '@/hooks/useBuilderStorage';
import { CartContext } from '@/components/ClientApplication';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as SiIcons from 'react-icons/si';
import * as BsIcons from 'react-icons/bs';

const getIconComponent = (iconName: string) => {
    if (!iconName) return FaIcons.FaBox;
    if (iconName.startsWith('Gi')) return (GiIcons as any)[iconName] || FaIcons.FaBox;
    if (iconName.startsWith('Si')) return (SiIcons as any)[iconName] || FaIcons.FaBox;
    if (iconName.startsWith('Bs')) return (BsIcons as any)[iconName] || FaIcons.FaBox;
    return (FaIcons as any)[iconName] || FaIcons.FaBox;
};

// ── Component Config (StarTech order) ─────────────────────────────────────────
const PC_CORE_CONFIG = [
    { key: 'cpu',         label: 'CPU',           reactIcon: 'BsCpu',         required: true  },
    { key: 'cooler',      label: 'CPU Cooler',    reactIcon: 'GiComputerFan', required: false },
    { key: 'motherboard', label: 'Motherboard',   reactIcon: 'GiCircuitry',   required: true  },
    { key: 'ram',         label: 'RAM',           reactIcon: 'FaMemory',      required: true  },
    { key: 'storage',     label: 'Storage',       reactIcon: 'FaHdd',         required: true  },
    { key: 'gpu',         label: 'Graphics Card', reactIcon: 'BsGpuCard',     required: false },
    { key: 'psu',         label: 'Power Supply',  reactIcon: '',  imageSrc: '/img/psu_logo.png', required: true },
    { key: 'casing',      label: 'Casing',        reactIcon: 'BsPc',          required: true  },
];

const PC_PERIPHERALS_CONFIG = [
    { key: 'monitor',   label: 'Monitor',   reactIcon: 'FaDesktop'    },
    { key: 'keyboard',  label: 'Keyboard',  reactIcon: 'FaKeyboard'   },
    { key: 'mouse',     label: 'Mouse',     reactIcon: 'FaMouse'      },
    { key: 'headphone', label: 'Headphone', reactIcon: 'FaHeadphones' },
    { key: 'speaker',   label: 'Speaker',   reactIcon: 'FaVolumeUp'   },
];

const REQUIRED_KEYS = PC_CORE_CONFIG.filter(c => c.required).map(c => c.key);

export default function PCBuilderPage() {
    const { addToCart } = useContext(CartContext);
    const router = useRouter();
    const [selections, setSelections] = useBuilderStorage<Record<string, any>>('pcBuilderState', {});
    const [peripheralsOpen, setPeripheralsOpen] = useState(false);

    const totalPrice   = Object.values(selections).reduce((s: number, i: any) => s + (i?.price   || 0), 0) as number;
    const totalWattage = Object.values(selections).reduce((s: number, i: any) => s + (i?.wattage || 0), 0) as number;
    const selectedRequired = REQUIRED_KEYS.filter(k => !!selections[k]).length;
    const selectedPeripheralsCount = PC_PERIPHERALS_CONFIG.filter(p => !!selections[p.key]).length;

    const handleRemove = (key: string) => {
        const n = { ...selections };
        delete n[key];
        setSelections(n);
    };

    const handleAddToCart = () => {
        Object.values(selections).forEach((item: any) => { if (item) addToCart(item, 1, false); });
        alert('All selected components added to cart!');
    };

    const renderRow = (config: any) => {
        const sel = selections[config.key];
        const Icon = config.imageSrc ? null : getIconComponent(config.reactIcon);

        return (
            <div key={config.key} className="component-row-compact">
                {/* Icon */}
                <div className="crc-icon">
                    {config.imageSrc ? (
                        <img src={config.imageSrc} alt={config.label}
                            style={{ width: 22, height: 22, objectFit: 'contain',
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(92%) saturate(687%) hue-rotate(345deg) brightness(97%) contrast(97%)' }} />
                    ) : (
                        Icon && <Icon color="#db4b27" size={22} />
                    )}
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
                    {sel ? sel.title : 'Choose a ' + config.label}
                </div>

                {/* Price */}
                <div className="component-price-compact">
                    {sel ? `৳${sel.price.toLocaleString()}` : '—'}
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
                        onClick={() => router.push(`/pc-builder/select/${config.key}`)}
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
                <h1>PC Builder</h1>
                <p className="subtitle">Select essential parts for your build — {selectedRequired}/{REQUIRED_KEYS.length} required components chosen</p>
            </div>

            {/* Core Components */}
            <div className="core-components-container">
                {PC_CORE_CONFIG.map(c => renderRow(c))}
            </div>

            {/* Peripherals (collapsible) */}
            <div className="peripherals-section">
                <div className="peripherals-header" onClick={() => setPeripheralsOpen(!peripheralsOpen)}>
                    <i className={`fas fa-chevron-${peripheralsOpen ? 'down' : 'right'}`}></i>
                    <span>Peripherals & Others</span>
                    <span className="peripherals-count">
                        {selectedPeripheralsCount} / {PC_PERIPHERALS_CONFIG.length} selected
                    </span>
                </div>
                {peripheralsOpen && (
                    <div className="peripherals-list">
                        {PC_PERIPHERALS_CONFIG.map(c => renderRow(c))}
                    </div>
                )}
            </div>

            {/* Sticky Summary Bar */}
            <div className="summary-bar-compact">
                <div className="summary-stats">
                    <div className="stat">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">৳{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Wattage:</span>
                        <span className="stat-value">{totalWattage}W</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Items:</span>
                        <span className="stat-value">{selectedRequired}/{REQUIRED_KEYS.length}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="sr-btn-secondary" onClick={() => window.print()}>
                        <i className="fas fa-print"></i> Print
                    </button>
                    <button
                        className="complete-build-btn"
                        onClick={handleAddToCart}
                        disabled={Object.values(selections).filter(Boolean).length === 0}
                    >
                        <i className="fas fa-shopping-cart"></i> Complete Build & Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
