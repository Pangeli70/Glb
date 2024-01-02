/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231110 Piccolo refactoring per ridenominazione consistente
 * @version 0.3 APG 20231226 Spostato nella libreria BrdGlb
 * ----------------------------------------------------------------------------
 */

import {
    THREE
} from "../deps.ts";

/**
 * Servizio per rimappare le texture sulle geometrie delle mesh
 */
export class BrdGlb_UVRemapperService {


    static CubeMapping(amesh: THREE.Mesh) {

        const vertices = amesh.geometry.getAttribute('position');
        const normals = amesh.geometry.getAttribute('normal');
        let uvs = amesh.geometry.getAttribute('uv');

        if (uvs === undefined) {
            const size = vertices.count * 2;
            uvs = new THREE.BufferAttribute(new Float32Array(size), 2);
            amesh.geometry.setAttribute('uv', uvs);
        }

        for (let i = 0; i < vertices.count; i++) {
            let u = 0, v = 0;

            const nx = Math.abs(normals.getX(i));
            const ny = Math.abs(normals.getY(i));
            const nz = Math.abs(normals.getZ(i));

            // if facing X
            if (nx >= ny && nx >= nz) {
                u = vertices.getZ(i) / 1000;
                v = vertices.getY(i) / 1000;
            }

            // if facing Y
            if (ny >= nx && ny >= nz) {
                u = vertices.getX(i) / 1000;
                v = vertices.getZ(i) / 1000;
            }

            // if facing Z
            if (nz >= nx && nz >= ny) {
                u = vertices.getX(i) / 1000;
                v = vertices.getY(i) / 1000;
            }

            uvs.setXY(i, u, v);
        }
        uvs.needsUpdate = true;
    }



    static Reset(amesh: THREE.Mesh, auOffset = 0, avOffset = 0) {

        const vertices = amesh.geometry.getAttribute('position');
        const normals = amesh.geometry.getAttribute('normal');
        const uvs = amesh.geometry.getAttribute('uv');

        let
            minx = vertices.getX(0),
            miny = vertices.getY(0),
            minz = vertices.getZ(0);
        let maxx = minx, maxy = miny, maxz = minz;
        for (let i = 1; i < vertices.count; i++) {
            const x = vertices.getX(i);
            if (x < minx) minx = x;
            if (x > maxx) maxx = x;
            const y = vertices.getY(i);
            if (y < miny) miny = y;
            if (y > maxy) maxy = y;
            const z = vertices.getZ(i);
            if (z < minz) minz = z;
            if (z > maxz) maxz = z;
        }
        const deltaX = maxx - minx;
        const deltaY = maxy - miny;
        const deltaZ = maxx - minz;

        for (let i = 0; i < vertices.count; i++) {
            let u = 0, v = 0;

            const nx = Math.abs(normals.getX(i));
            const ny = Math.abs(normals.getY(i));
            const nz = Math.abs(normals.getZ(i));

            // if facing X
            if (nx >= ny && nx >= nz) {
                u = (vertices.getZ(i) - minz) / deltaZ;
                v = (vertices.getY(i) - miny) / deltaY;
            }

            // if facing Y
            if (ny >= nx && ny >= nz) {
                u = (vertices.getX(i) - minx) / deltaX;
                v = (vertices.getZ(i) - minz) / deltaZ;
            }

            // if facing Z
            if (nz >= nx && nz >= ny) {
                u = (vertices.getX(i) - minx) / deltaX;
                v = (vertices.getY(i) - miny) / deltaY;
            }

            u += auOffset;
            // if (u > 1) u -= 1;
            v += avOffset;
            // if (v > 1) v -= 1;

            uvs.setXY(i, u, v);
        }
        uvs.needsUpdate = true;
    }
}

/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved 
 * @licence You cannot host, display, distribute or share this Work in any 
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * --------------------------------------------------------------------------- 
 */