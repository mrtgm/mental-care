// 描画エリアの論理サイズ
export const PLOT_AREA = {
  marginTop: 10,
  marginLeft: 40,
  marginRight: 20,
  marginBottom: 40,
  width: 400,
  height: 200,

  get totalWidth() {
    return this.marginLeft + this.width;
  },
  get totalHeight() {
    return this.marginTop + this.height + this.marginBottom;
  },
};

// 描画エリアの最大物理サイズ
export const MAX_HEIGHT = 300;
