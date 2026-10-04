"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    MeshBasicMaterial,
    Color,
    Mesh,
    Group,
    InstancedMesh,
    Matrix4,
    Raycaster,
    Vector2,
    TubeGeometry,
    CatmullRomCurve3,
    Vector3,
    CanvasTexture,
} from "three";

type Rgba = { r: number; g: number; b: number; a: number };

function parseColorToRgba(input: string): Rgba {
    if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 0 };
    const str = input.trim();
    const rgbaMatch = str.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i
    );
    if (rgbaMatch) {
        const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
        const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
        const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
        const a =
            rgbaMatch[4] !== undefined
                ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
                : 1;
        return { r, g, b, a };
    }
    const hex = str.replace(/^#/, "");
    if (hex.length === 8) {
        return {
            r: parseInt(hex.slice(0, 2), 16) / 255,
            g: parseInt(hex.slice(2, 4), 16) / 255,
            b: parseInt(hex.slice(4, 6), 16) / 255,
            a: parseInt(hex.slice(6, 8), 16) / 255,
        };
    }
    if (hex.length === 6) {
        return {
            r: parseInt(hex.slice(0, 2), 16) / 255,
            g: parseInt(hex.slice(2, 4), 16) / 255,
            b: parseInt(hex.slice(4, 6), 16) / 255,
            a: 1,
        };
    }
    if (hex.length === 4) {
        return {
            r: parseInt(hex[0] + hex[0], 16) / 255,
            g: parseInt(hex[1] + hex[1], 16) / 255,
            b: parseInt(hex[2] + hex[2], 16) / 255,
            a: parseInt(hex[3] + hex[3], 16) / 255,
        };
    }
    if (hex.length === 3) {
        return {
            r: parseInt(hex[0] + hex[0], 16) / 255,
            g: parseInt(hex[1] + hex[1], 16) / 255,
            b: parseInt(hex[2] + hex[2], 16) / 255,
            a: 1,
        };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    if (inMax === inMin) return outMin;
    const t = (value - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui: number): number {
    if (ui === 0) return 0;
    const clamped = Math.max(0, Math.min(10, ui));
    return mapLinear(clamped, 0, 10, 0, 0.9);
}
function mapDensityUiToSpacing(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 24, 7);
}
function mapScaleUiToMultiplier(ui: number): number {
    const clamped = Math.max(1, Math.min(20, ui));
    return mapLinear(clamped, 1, 20, 0.2, 2);
}
// Enhanced multiplier so land points are clearly defined (not microscopic sub-pixels)
function mapDotSizeUiToMultiplier(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 0.8, 2.4);
}
function mapMarkerDotSizeUiToMultiplier(ui: number): number {
    const clamped = Math.max(0, Math.min(100, ui));
    return mapLinear(clamped, 0, 100, 0.8, 3.2);
}
function normalizeSmoothing(ui: number): number {
    return Math.max(0, Math.min(1, ui / 10));
}
function mapDragSpeedUiToSensitivity(ui: number): number {
    return mapLinear(Math.max(0, Math.min(10, ui)), 0, 10, 0.001, 0.02);
}
function mapDetailToStepSize(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 10, 1);
}

function simplifyRing(ring: number[][], detail: number): number[][] {
    if (ring.length < 2) return ring;
    if (detail >= 10) return ring;
    const stepSize = Math.max(1, Math.floor(mapDetailToStepSize(detail)));
    const simplified: number[][] = [];
    simplified.push(ring[0]);
    for (let i = stepSize; i < ring.length - 1; i += stepSize) {
        const idx = Math.min(i, ring.length - 1);
        simplified.push(ring[idx]);
    }
    const lastPoint = ring[ring.length - 1];
    const firstPoint = ring[0];
    const isClosed =
        Math.abs(lastPoint[0] - firstPoint[0]) < 1e-4 &&
        Math.abs(lastPoint[1] - firstPoint[1]) < 1e-4;
    if (!isClosed) {
        simplified.push(lastPoint);
    }
    return simplified.length >= 2 ? simplified : ring;
}

function latLngToPosition(
    lat: number,
    lng: number
): { x: number; y: number; z: number } {
    const latRad = lat * (Math.PI / 180);
    const lngRad = lng * (Math.PI / 180);
    const x = Math.cos(latRad) * Math.sin(lngRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.cos(lngRad);
    return { x, y, z };
}

// Equirectangular projection path drawer for standard GeoJSON features (no external dependencies required)
function drawGeoFeaturesToContext(
    ctx: CanvasRenderingContext2D,
    features: any[],
    width: number,
    height: number
) {
    const projectX = (lng: number) => ((lng + 180) / 360) * width;
    const projectY = (lat: number) => ((90 - lat) / 180) * height;

    const drawRing = (ring: number[][]) => {
        if (!ring || ring.length < 2) return;
        ctx.moveTo(projectX(ring[0][0]), projectY(ring[0][1]));
        for (let i = 1; i < ring.length; i++) {
            ctx.lineTo(projectX(ring[i][0]), projectY(ring[i][1]));
        }
        ctx.closePath();
    };

    features.forEach((feature) => {
        const geometry = feature.geometry;
        if (!geometry || !geometry.coordinates) return;

        if (geometry.type === "Polygon") {
            geometry.coordinates.forEach(drawRing);
        } else if (geometry.type === "MultiPolygon") {
            geometry.coordinates.forEach((polygon: any) => {
                if (polygon && polygon.length > 0) {
                    polygon.forEach(drawRing);
                }
            });
        }
    });
}

export interface Marker {
    lat: number;
    lng: number;
}
export interface MarkerConfig {
    markers: Marker[];
    color: string;
    size: number;
}
export interface DotsConfig {
    color: string;
    size: number;
    density: number;
    allDots: boolean;
}
export interface GlobeProps {
    speed?: number;
    smoothing?: number;
    dots?: DotsConfig;
    fill?: "dots" | "solid";
    fillColor?: string;
    scale?: number;
    stopOnHover?: boolean;
    markerConfig?: MarkerConfig;
    direction?: "left" | "right";
    initialLatitude?: number;
    initialLongitude?: number;
    oceanColor?: string;
    outlineColor?: string;
    showOutline?: boolean;
    graticuleColor?: string;
    showGrid?: boolean;
    outlineWidth?: number;
    dragSpeed?: number;
    detail?: number;
    style?: CSSProperties;
    className?: string;
}

export default function Globe({
    speed = 0.6,
    smoothing = 7,
    dots = { color: "#39B9FF", size: 8, density: 8, allDots: false },
    fill = "dots",
    fillColor = "#39B9FF",
    scale = 6,
    stopOnHover = true,
    markerConfig = {
        markers: [{ lat: 18.5204, lng: 73.8567 }], // Pune coordinates
        color: "#7C5CFF",
        size: 35,
    },
    direction = "left",
    initialLatitude = 18,
    initialLongitude = -74,
    oceanColor = "#05070B",
    outlineColor = "#67E8F9",
    showOutline = true,
    graticuleColor = "rgba(57,185,255,0.10)",
    showGrid = false,
    outlineWidth = 1.2,
    dragSpeed = 4,
    detail = 5,
    style,
    className = "",
}: GlobeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dotColor = dots.color;
    const dotSize = dots.size;
    const density = dots.density;
    const allDots = dots.allDots;
    const gridWidth = 1;
    const smoothingN = normalizeSmoothing(smoothing);

    const baseRotationSpeed = mapSpeedUiToInternal(speed);
    const rotationSpeed =
        direction === "left" ? -baseRotationSpeed : baseRotationSpeed;
    const dotSpacing = mapDensityUiToSpacing(density);
    const dotSizeMultiplier = mapDotSizeUiToMultiplier(dotSize);
    const markerRadiusMultiplier = mapMarkerDotSizeUiToMultiplier(
        markerConfig.size
    );
    const scaleMultiplier = mapScaleUiToMultiplier(scale);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerWidth =
            container.clientWidth || container.offsetWidth || 520;
        const containerHeight =
            container.clientHeight || container.offsetHeight || 520;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            50,
            containerWidth / containerHeight,
            0.1,
            1e3
        );
        const baseRadius = 1;
        const globeRadius = baseRadius * scaleMultiplier;
        
        // Proper camera framing: frames the globe at ~70-75% of container height (400–450px on desktop)
        const cameraDistance = 1.45 / scaleMultiplier;
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);

        const renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = "srgb";
        const canvas = renderer.domElement;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.opacity = "1";
        canvas.style.visibility = "visible";
        container.appendChild(canvas);

        const resolvedOceanColor = oceanColor;
        const resolvedOutlineColor = outlineColor;
        const resolvedDotColor = dotColor;
        const resolvedMarkerColor = markerConfig.color;
        const resolvedGraticuleColor = graticuleColor;
        const resolvedFillColor = fillColor;
        const oceanRgba = parseColorToRgba(resolvedOceanColor);
        const outlineRgba = parseColorToRgba(resolvedOutlineColor);
        const dotRgba = parseColorToRgba(resolvedDotColor);
        const markerRgba = parseColorToRgba(resolvedMarkerColor);
        const graticuleRgba = parseColorToRgba(resolvedGraticuleColor);
        const fillRgba = parseColorToRgba(resolvedFillColor);
        void markerRgba;

        // Dark base ocean sphere
        const oceanGeometry = new SphereGeometry(globeRadius, 64, 64);
        const oceanColorObj = resolvedOceanColor
            ? new Color(resolvedOceanColor)
            : new Color(0.02, 0.03, 0.05);
        const oceanMaterial = new MeshBasicMaterial({
            color: oceanColorObj,
            transparent: true,
            opacity: 0.95,
        });
        const oceanMesh = new Mesh(oceanGeometry, oceanMaterial);
        scene.add(oceanMesh);

        // Fixed outer circular rim outline around the globe facing the camera
        let globeOutlineMesh: Mesh | null = null;
        if (showOutline && outlineColor && outlineRgba.a > 0) {
            const outlinePositions: number[] = [];
            const segments = 128;
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const x = Math.cos(angle) * (globeRadius * 1.006);
                const y = Math.sin(angle) * (globeRadius * 1.006);
                const z = 0;
                outlinePositions.push(x, y, z);
            }
            const outlinePoints: Vector3[] = [];
            for (let i = 0; i < outlinePositions.length; i += 3) {
                outlinePoints.push(
                    new Vector3(
                        outlinePositions[i],
                        outlinePositions[i + 1],
                        outlinePositions[i + 2]
                    )
                );
            }
            if (outlinePoints.length >= 2) {
                outlinePoints.push(outlinePoints[0].clone());
                const outlineColorObj = new Color(resolvedOutlineColor);
                const outlineMaterial = new MeshBasicMaterial({
                    color: outlineColorObj,
                    transparent: true,
                    opacity: 0.45,
                });
                const curve = new CatmullRomCurve3(outlinePoints);
                const radius = (outlineWidth / 10) * 0.014;
                const tubeGeometry = new TubeGeometry(
                    curve,
                    outlinePoints.length * 2,
                    radius,
                    8,
                    false
                );
                globeOutlineMesh = new Mesh(tubeGeometry, outlineMaterial);
                // ATTACH TO SCENE: This forms the subtle glowing cyan outer contour ring
                scene.add(globeOutlineMesh);
            }
        }

        const continentOutlineGroup = new Group();

        const graticuleGroup = new Group();
        if (showGrid && resolvedGraticuleColor && graticuleRgba.a > 0) {
            const graticuleColorObj = resolvedGraticuleColor
                ? new Color(resolvedGraticuleColor)
                : new Color(1, 1, 1);
            const graticuleMaterial = new MeshBasicMaterial({
                color: graticuleColorObj,
                transparent: true,
                opacity: 0.15,
            });
            const gridSpacing = 20;
            for (let lat = -80; lat <= 80; lat += gridSpacing) {
                const positions: number[] = [];
                const segments = 64;
                for (let i = 0; i <= segments; i++) {
                    const lng = (i / segments) * 360 - 180;
                    const pos = latLngToPosition(lat, lng);
                    positions.push(
                        pos.x * globeRadius * 1.002,
                        pos.y * globeRadius * 1.002,
                        pos.z * globeRadius * 1.002
                    );
                }
                if (positions && positions.length >= 6) {
                    const points: Vector3[] = [];
                    for (let i = 0; i < positions.length; i += 3) {
                        points.push(
                            new Vector3(
                                positions[i],
                                positions[i + 1],
                                positions[i + 2]
                            )
                        );
                    }
                    if (points.length >= 2) {
                        const curve = new CatmullRomCurve3(points);
                        const radius = (gridWidth / 10) * 0.008;
                        const tubeGeometry = new TubeGeometry(
                            curve,
                            points.length,
                            radius,
                            6,
                            false
                        );
                        const tubeMesh = new Mesh(
                            tubeGeometry,
                            graticuleMaterial
                        );
                        graticuleGroup.add(tubeMesh);
                    }
                }
            }
        }

        let dotInstances: InstancedMesh | Mesh | null = null;
        let markerMeshes: Mesh[] = [];

        const loadWorldData = async () => {
            try {
                setIsLoading(true);

                // Priority 1: Load from local asset directory (instantaneous, offline, reliable)
                let response: Response;
                try {
                    response = await fetch("/assets/data/ne_50m_land.json");
                    if (!response.ok) throw new Error("Local asset 404");
                } catch {
                    // Priority 2: Fallback to GitHub raw
                    response = await fetch(
                        "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json"
                    );
                }

                if (!response.ok) throw new Error("Failed to load land data from local or remote");
                const landFeatures = await response.json();

                // Clean up previous continent outline children
                while (continentOutlineGroup.children.length > 0) {
                    continentOutlineGroup.remove(
                        continentOutlineGroup.children[0]
                    );
                }

                // Render continent outline curves with cyan highlight
                if (showOutline && outlineColor && outlineRgba.a > 0) {
                    const outlineColorObj = new Color(resolvedOutlineColor);
                    const outlineMaterial = new MeshBasicMaterial({
                        color: outlineColorObj,
                        transparent: true,
                        opacity: 0.35,
                    });

                    landFeatures.features.forEach((feature: any) => {
                        const geometry = feature.geometry;
                        if (!geometry || !geometry.coordinates) return;

                        const processRing = (ring: number[][]) => {
                            if (ring.length < 3) return;
                            const simplifiedRing = simplifyRing(ring, detail);
                            const positions: number[] = [];
                            simplifiedRing.forEach((coord) => {
                                const [lng, lat] = coord;
                                const pos = latLngToPosition(lat, lng);
                                // Position slightly above the ocean surface
                                positions.push(
                                    pos.x * globeRadius * 1.004,
                                    pos.y * globeRadius * 1.004,
                                    pos.z * globeRadius * 1.004
                                );
                            });
                            if (positions && positions.length >= 6) {
                                const points: Vector3[] = [];
                                for (let i = 0; i < positions.length; i += 3) {
                                    points.push(
                                        new Vector3(
                                            positions[i],
                                            positions[i + 1],
                                            positions[i + 2]
                                        )
                                    );
                                }
                                if (
                                    points.length > 0 &&
                                    points[0].distanceTo(
                                        points[points.length - 1]
                                    ) > 0.001
                                ) {
                                    points.push(points[0].clone());
                                }
                                if (points.length >= 2) {
                                    const curve = new CatmullRomCurve3(points);
                                    const radius = (outlineWidth / 10) * 0.01;
                                    const tubeGeometry = new TubeGeometry(
                                        curve,
                                        Math.min(points.length * 2, 64),
                                        radius,
                                        6,
                                        false
                                    );
                                    const tubeMesh = new Mesh(
                                        tubeGeometry,
                                        outlineMaterial
                                    );
                                    tubeMesh.renderOrder = 1;
                                    continentOutlineGroup.add(tubeMesh);
                                }
                            }
                        };

                        if (
                            geometry.type === "Polygon" &&
                            geometry.coordinates.length > 0
                        ) {
                            processRing(geometry.coordinates[0]);
                        } else if (geometry.type === "MultiPolygon") {
                            geometry.coordinates.forEach((polygon: any) => {
                                if (polygon && polygon.length > 0) {
                                    processRing(polygon[0]);
                                }
                            });
                        }
                    });
                }

                // Render Land Mask on Offscreen Canvas for accurate land testing
                const bitmapWidth = 2048;
                const bitmapHeight = 1024;
                const offscreenCanvas = document.createElement("canvas");
                offscreenCanvas.width = bitmapWidth;
                offscreenCanvas.height = bitmapHeight;
                const ctx = offscreenCanvas.getContext("2d", {
                    willReadFrequently: true,
                });
                if (!ctx) throw new Error("Canvas 2D context not supported");

                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, bitmapWidth, bitmapHeight);
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                drawGeoFeaturesToContext(
                    ctx,
                    landFeatures.features,
                    bitmapWidth,
                    bitmapHeight
                );
                ctx.fill();

                const imageData = ctx.getImageData(
                    0,
                    0,
                    bitmapWidth,
                    bitmapHeight
                );
                const pixels = imageData.data;
                const isOnLand = (lng: number, lat: number) => {
                    const x =
                        Math.round(((lng + 180) / 360) * bitmapWidth) %
                        bitmapWidth;
                    const y = Math.round(((90 - lat) / 180) * bitmapHeight);
                    const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
                    const idx = (clampedY * bitmapWidth + x) * 4;
                    return pixels[idx] > 128;
                };

                if (fill === "solid") {
                    const texW = 1024;
                    const texH = 512;
                    const fillCanvas = document.createElement("canvas");
                    fillCanvas.width = texW;
                    fillCanvas.height = texH;
                    const fctx = fillCanvas.getContext("2d")!;
                    const img = fctx.createImageData(texW, texH);
                    const data = img.data;
                    const fr = Math.round(fillRgba.r * 255);
                    const fg = Math.round(fillRgba.g * 255);
                    const fb = Math.round(fillRgba.b * 255);
                    const fa = Math.round((fillRgba.a || 1) * 255);
                    for (let ty = 0; ty < texH; ty++) {
                        for (let tx = 0; tx < texW; tx++) {
                            const u = tx / texW;
                            const v = ty / texH;
                            let lng = (u - 0.25) * 360;
                            lng = ((((lng + 180) % 360) + 360) % 360) - 180;
                            const lat = (v - 0.5) * 180;
                            const onLand = allDots || isOnLand(lng, lat);
                            const idx = (ty * texW + tx) * 4;
                            if (onLand) {
                                data[idx] = fr;
                                data[idx + 1] = fg;
                                data[idx + 2] = fb;
                                data[idx + 3] = fa;
                            } else {
                                data[idx + 3] = 0;
                            }
                        }
                    }
                    fctx.putImageData(img, 0, 0);
                    const fillTexture = new CanvasTexture(fillCanvas);
                    fillTexture.flipY = false;
                    fillTexture.needsUpdate = true;
                    const fillGeometry = new SphereGeometry(
                        globeRadius * 1.002,
                        64,
                        64
                    );
                    const fillMaterial = new MeshBasicMaterial({
                        map: fillTexture,
                        transparent: true,
                    });
                    dotInstances = new Mesh(fillGeometry, fillMaterial);
                    globeGroup.add(dotInstances);
                } else {
                    const dotCoordinates: number[][] = [];
                    const baseStep = dotSpacing * 0.08;
                    for (let lat = -88; lat <= 88; lat += baseStep) {
                        const latRad = (Math.abs(lat) * Math.PI) / 180;
                        const cosLat = Math.cos(latRad);
                        const lngStep =
                            cosLat > 0.01
                                ? baseStep / Math.max(0.3, cosLat)
                                : 360;
                        for (let lng = -180; lng < 180; lng += lngStep) {
                            if (allDots || isOnLand(lng, lat)) {
                                dotCoordinates.push([lng, lat]);
                            }
                        }
                    }

                    if (dotCoordinates.length > 0) {
                        // Increased dot sphere radius so each dot is clearly defined and visible
                        const dotRadius = 0.008 * dotSizeMultiplier;
                        const dotGeometry = new SphereGeometry(
                            dotRadius,
                            8,
                            8
                        );
                        const dotColorObj = resolvedDotColor
                            ? new Color(resolvedDotColor)
                            : new Color("#39B9FF");
                        const dotMaterial = new MeshBasicMaterial({
                            color: dotColorObj,
                            transparent: true,
                            opacity: 0.95,
                        });
                        const instanced = new InstancedMesh(
                            dotGeometry,
                            dotMaterial,
                            dotCoordinates.length
                        );
                        const matrix = new Matrix4();
                        for (let i = 0; i < dotCoordinates.length; i++) {
                            const [lng, lat] = dotCoordinates[i];
                            const pos = latLngToPosition(lat, lng);
                            matrix.makeScale(1, 1, 1);
                            // Position dots cleanly on top of the ocean sphere without z-fighting
                            matrix.setPosition(
                                pos.x * globeRadius * 1.008,
                                pos.y * globeRadius * 1.008,
                                pos.z * globeRadius * 1.008
                            );
                            instanced.setMatrixAt(i, matrix);
                        }
                        instanced.instanceMatrix.needsUpdate = true;
                        instanced.renderOrder = 2;
                        dotInstances = instanced;
                        globeGroup.add(dotInstances);
                    }
                }

                updateMarkers();
                renderer.render(scene, camera);
                setIsLoading(false);
            } catch (err) {
                console.error("Globe data load error:", err);
                setError("Failed to load land map data");
                setIsLoading(false);
            }
        };

        const updateMarkers = () => {
            markerMeshes.forEach((mesh) => globeGroup.remove(mesh));
            markerMeshes = [];
            if (markerConfig.markers && markerConfig.markers.length > 0) {
                // Sized to be distinctly visible as a refined violet accent dot
                const markerSize = 0.016 * markerRadiusMultiplier;
                const markerGeometry = new SphereGeometry(markerSize, 16, 16);
                const markerColorObj = resolvedMarkerColor
                    ? new Color(resolvedMarkerColor)
                    : new Color("#7C5CFF");
                const markerMaterial = new MeshBasicMaterial({
                    color: markerColorObj,
                    transparent: true,
                    opacity: 1.0,
                });

                markerConfig.markers.forEach((marker) => {
                    if (
                        !marker ||
                        typeof marker.lat !== "number" ||
                        typeof marker.lng !== "number"
                    )
                        return;
                    const pos = latLngToPosition(marker.lat, marker.lng);
                    const markerMesh = new Mesh(
                        markerGeometry,
                        markerMaterial.clone()
                    );
                    markerMesh.position.set(
                        pos.x * globeRadius * 1.018,
                        pos.y * globeRadius * 1.018,
                        pos.z * globeRadius * 1.018
                    );
                    markerMesh.renderOrder = 10;
                    globeGroup.add(markerMesh);
                    markerMeshes.push(markerMesh);
                });
            }
        };

        const initialLongitudeRad = (initialLongitude * Math.PI) / 180;
        const initialLatitudeRad = (initialLatitude * Math.PI) / 180;
        const rotation = { x: initialLongitudeRad, y: initialLatitudeRad };
        const targetRotation = {
            x: initialLongitudeRad,
            y: initialLatitudeRad,
        };
        const velocity = { x: 0, y: 0 };
        let isDragging = false;
        let isHovering = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let animationFrameId: number | null = null;
        const lerpFactor =
            smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
        const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

        const globeGroup = new Group();
        globeGroup.rotation.y = initialLongitudeRad;
        globeGroup.rotation.x = initialLatitudeRad;
        scene.add(globeGroup);
        globeGroup.add(oceanMesh);
        if (showGrid && graticuleColor && graticuleRgba.a > 0) {
            globeGroup.add(graticuleGroup);
        }
        globeGroup.add(continentOutlineGroup);
        markerMeshes.forEach((mesh) => globeGroup.add(mesh));

        // Initial render so canvas displays immediately upon mounting
        renderer.render(scene, camera);

        const animate = () => {
            let needsRender = false;
            const threshold = 0.001;
            if (
                !isDragging &&
                rotationSpeed !== 0 &&
                (!stopOnHover || !isHovering)
            ) {
                targetRotation.x += rotationSpeed * 0.01;
            }
            if (!isDragging && smoothingN > 0) {
                if (
                    Math.abs(velocity.x) > threshold ||
                    Math.abs(velocity.y) > threshold
                ) {
                    targetRotation.x += velocity.x;
                    targetRotation.y += velocity.y;
                    targetRotation.y = Math.max(
                        -Math.PI / 2,
                        Math.min(Math.PI / 2, targetRotation.y)
                    );
                    velocity.x *= velocityDecay;
                    velocity.y *= velocityDecay;
                } else {
                    velocity.x = 0;
                    velocity.y = 0;
                }
            }
            const dx = targetRotation.x - rotation.x;
            const dy = targetRotation.y - rotation.y;
            if (
                Math.abs(dx) > threshold ||
                Math.abs(dy) > threshold ||
                rotationSpeed !== 0 ||
                isDragging
            ) {
                rotation.x += dx * lerpFactor;
                rotation.y += dy * lerpFactor;
                rotation.y = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, rotation.y)
                );
                needsRender = true;
            }
            if (needsRender || rotationSpeed !== 0 || isDragging) {
                globeGroup.rotation.y = rotation.x;
                globeGroup.rotation.x = rotation.y;
                renderer.render(scene, camera);
            }
            const hasVelocity =
                Math.abs(velocity.x) > threshold ||
                Math.abs(velocity.y) > threshold;
            const hasLerpDelta =
                Math.abs(dx) > threshold || Math.abs(dy) > threshold;
            const needsContinue =
                isDragging || rotationSpeed !== 0 || hasVelocity || hasLerpDelta;
            if (needsContinue) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                animationFrameId = null;
            }
        };

        const startAnimation = () => {
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        if (rotationSpeed !== 0) {
            startAnimation();
        }

        const handleMouseDown = (event: MouseEvent) => {
            isDragging = true;
            velocity.x = 0;
            velocity.y = 0;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            startAnimation();
            const handleMouseMoveDrag = (moveEvent: MouseEvent) => {
                const sensitivity = mapDragSpeedUiToSensitivity(dragSpeed);
                const dx = moveEvent.clientX - lastMouseX;
                const dy = moveEvent.clientY - lastMouseY;
                targetRotation.x += dx * sensitivity;
                targetRotation.y += dy * sensitivity;
                targetRotation.y = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, targetRotation.y)
                );
                velocity.x = dx * sensitivity * 0.3;
                velocity.y = dy * sensitivity * 0.3;
                lastMouseX = moveEvent.clientX;
                lastMouseY = moveEvent.clientY;
            };
            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMoveDrag);
                document.removeEventListener("mouseup", handleMouseUp);
                isDragging = false;
            };
            document.addEventListener("mousemove", handleMouseMoveDrag);
            document.addEventListener("mouseup", handleMouseUp);
        };
        canvas.addEventListener("mousedown", handleMouseDown);

        const raycaster = new Raycaster();
        const mouse = new Vector2();
        const handleMouseMove = (event: MouseEvent) => {
            if (!stopOnHover) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(oceanMesh);
            isHovering = intersects.length > 0;
        };
        canvas.addEventListener("mousemove", handleMouseMove);

        const resizeObserver = new ResizeObserver(() => {
            const newWidth =
                container.clientWidth || container.offsetWidth || 520;
            const newHeight =
                container.clientHeight || container.offsetHeight || 520;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            const newCameraDistance = 1.45 / scaleMultiplier;
            camera.position.set(0, 0, newCameraDistance);
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        });
        resizeObserver.observe(container);

        loadWorldData();

        return () => {
            if (animationFrameId !== null)
                cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            resizeObserver.disconnect();
            renderer.dispose();
            if (container.contains(canvas)) {
                container.removeChild(canvas);
            }
        };
    }, [
        speed,
        smoothing,
        dots,
        fill,
        fillColor,
        allDots,
        density,
        dotSize,
        dotColor,
        scale,
        stopOnHover,
        markerConfig,
        direction,
        initialLatitude,
        initialLongitude,
        oceanColor,
        outlineColor,
        showOutline,
        graticuleColor,
        showGrid,
        outlineWidth,
        dragSpeed,
        detail,
        rotationSpeed,
        dotSpacing,
        dotSizeMultiplier,
        markerRadiusMultiplier,
        scaleMultiplier,
    ]);

    const containerStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
    };

    if (error) {
        return (
            <div style={containerStyle} className={className}>
                {/* Silent dark container fallback */}
            </div>
        );
    }

    return <div ref={containerRef} style={containerStyle} className={className} />;
}
