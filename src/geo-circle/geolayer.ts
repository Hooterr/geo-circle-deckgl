import { Accessor, Color, Layer, LayerContext, LineLayer, Position } from 'deck.gl';
import { LayerDataSource, project32, UpdateParameters } from '@deck.gl/core';
import { Geometry } from '@luma.gl/engine';
import { Model } from '@luma.gl/engine';
import vs from './geo-circle-layer-vertex.glsl';
import fs from './geo-circle-layer-fragment.glsl';

export type GeoCircleProps<DataT = unknown> = _GeoCircleProps<DataT>;

interface _GeoCircleProps<DataT> {
    data: LayerDataSource<DataT>,
    getCenter: Accessor<DataT, Position>,
    getRadius: Accessor<DataT, number>,
    getColor: Accessor<DataT, Color>,
}

export class GeoCircle<DataT = any, ExtraPropsT extends {} = {}> extends Layer<ExtraPropsT & Required<GeoCircleProps<DataT>>> {

    state!: {
        model?: Model;
        worldPositions: Float32Array,
    };

    initializeState(_: LayerContext): void {

        const attributeManager = this.getAttributeManager();
        attributeManager!.addInstanced({
            instanceCenter: {
                size: 3,
                type: 'float64',
                fp64: this.use64bitPositions(),
                transition: true,
                accessor: "getCenter"
            },
            instanceRadius: {
                size: 1,
                type: 'float32',
                transition: true,
                accessor: "getRadius",
            },
            instanceColor: {
                size: this.props.colorFormat.length,
                type: 'unorm8',
                transition: true,
                accessor: "getColor",
                defaultValue: [0, 0, 0, 255],
            },
        });
       //attributeManager!.add({
       //    worldPositions: {
       //     id: 'worldPositions',
       //        size: 2,
       //        type: 'float32', 
       //        stepMode: "vertex",
       //        accessor: () => this.state.worldPositions},
       //});
    }

    draw({ uniforms }: any): void {
        const model = this.state.model;
        model!.draw(this.context.renderPass);
    }

    shouldUpdateState(params: UpdateParameters<Layer<ExtraPropsT & Required<GeoCircleProps<DataT>>>>): boolean {
        if (params.changeFlags.viewportChanged || params.changeFlags.dataChanged || params.changeFlags.extensionsChanged) {
            return true;
        }
        return false;
    }

    updateState(params: UpdateParameters<this>): void {
        super.updateState(params);
        if (params.changeFlags.extensionsChanged || params.changeFlags.viewportChanged) {
            this.state.model?.destroy();
            this.state.model = this._getModel();
            this.getAttributeManager()!.invalidateAll();
        }

        if (params.changeFlags.viewportChanged) {
            const viewport = this.context.viewport;
            const projectPosition = (pos: number[]) => viewport.projectFlat(viewport.unproject(pos));
            //this.state.worldPositions = [
            //    ...projectPosition([0, 0, 0]),
            //    ...projectPosition([viewport.width, 0, 0]),
            //    ...projectPosition([0, viewport.height, 0]),
            //    ...projectPosition([viewport.width, viewport.height, 0]),
            //];
            //this.state.worldPositions = new Float32Array([0,0, 100, 0, 0,100, 100,100]);
            //console.log(this.state.worldPositions);
            //this.getAttributeManager()?.invalidate("worldPositions");
        }
            
    }

    protected _getModel() {
        // a square that minimally cover the unit circle
        const positions = [
            -1, -1,  0,
             1, -1,  0,
            -1,  1,  0,
             1,  1,  0
        ];
        const viewport = this.context.viewport;
        const projectPosition = (pos: number[]) => viewport.projectFlat(viewport.unproject(pos));

        const a= [
            ...projectPosition([0, viewport.height, 1]),
            ...projectPosition([viewport.width, viewport.height, 1]),
            ...projectPosition([0, 0, 1]),
            ...projectPosition([viewport.width, 0, 1]),
        ];
        return new Model(this.context.device, {
           

            ...this.getShaders(),
            id: this.props.id,
            bufferLayout: this.getAttributeManager()!.getBufferLayouts(),
            geometry: new Geometry({
                topology: 'triangle-strip',
                attributes: {
                    positions: { size: 3, value: new Float32Array(positions) },
                    worldPositions: {size: 2, value: new Float32Array(a) },
                }
            }),
            isInstanced: true
        });
    }

    getShaders() {
        return super.getShaders({ vs, fs, modules: [project32] });
    }

};

GeoCircle.layerName = 'Circle Layer';
GeoCircle.defaultProps = {
    radius: 10,
    color: [255, 255, 255],
};