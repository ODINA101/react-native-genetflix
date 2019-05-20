
package irakli.samniashvili.app;

import android.app.Application;

import com.facebook.react.ReactApplication;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import ui.shine.RNShineButtonPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.rpt.reactnativecheckpackageinstallation.CheckPackageInstallationPackage;
import com.reactnative.googlecast.GoogleCastPackage;
import com.wog.videoplayer.VideoPlayerPackage;
import com.masteratul.downloadmanager.ReactNativeDownloadManagerPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(new RNCWebViewPackage(), new RNShineButtonPackage(),
                new FBSDKPackage(mCallbackManager), new VectorIconsPackage(), // eg. new VectorIconsPackage()
                new KCKeepAwakePackage(), new ReactNativeDownloadManagerPackage(),
                new CheckPackageInstallationPackage(), new VideoPlayerPackage(), new LinearGradientPackage(),
                new RNAdMobPackage(), new ReactVideoPackage(), new GoogleCastPackage(),
                new InAppBillingBridgePackage());
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

}
