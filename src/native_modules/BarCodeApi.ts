import { NativeModules } from 'react-native';

const { BarCodeApiModule } = NativeModules;

interface BarCodeApiModuleInterface {
  scanBarcodes(name: string, location: string): [];
  addScannerListener(barcodes: []): void;
}

export default BarCodeApiModule as BarCodeApiModuleInterface;

