import { NativeModules } from 'react-native';

const { BarCodeApiModule } = NativeModules;

interface BarCodeApiModuleInterface {
  scanBarCodes(name: string, location: string): void;
}

export default BarCodeApiModule as BarCodeApiModuleInterface;

