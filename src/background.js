const FACEBOOK_CONTAINER_DETAILS = {
  name: "Facebook",
  color: "toolbar",
  icon: "fence"
};

const FACEBOOK_DOMAINS = [
  // Facebook
  "facebook.com", "facebook.net", "facebookmail.com", "fb.com", "fb.me",
  // Messenger
  "messenger.com", "m.me",
  // Instagram
  "instagram.com", "instagram-brand.com",
  // Whatsapp
  "whatsapp.com",
  // Lasso
  "lassovideos.com",
  // Workplace
  "workplace.com",
  // Libra
  "calibra.com",
  // CDN Static, Tracking, Back-end
  "atdmt.com", "cdninstagram.com", "connect.facebook.net.edgekey.net", "facebook-web-clients.appspot.com", "fbcdn-profile-a.akamaihd.net", "fbcdn.com", "fbcdn.net", "fbsbx.com", "fbsbx.com.online-metrix.net", "instagramstatic-a.akamaihd.net", "instagramstatic-a.akamaihd.net.edgesuite.net", "tfbnw.net", "fbaddins.com",
  // Onavo
  "onavo.com", "onavo.net", "onavo.org",
  // Oculus
  "oculus.com", "oculusbrand.com", "oculusforbusiness.com", "oculusrift.com", "oculusvr.com",
  // Facebook Design
  "facebook.design", "facebookbrand.com",
  // Zuckerberg
  "chanzuckerberg.com", "markzuckerberg.com", "tellmarkzuckerberg.com", "tellzuck.com", "zuckerberg.com", "zuckerberg.net",
  // Facebook Careers
  "contentstrategyfellowship.com", "fbrpms.com", "fburl.com", "workatatlas.com", "workforatlas.com",
  // Registrar
  "registrarsafe.com", "registrarsec.com",
  // Internet
  "expresswifi.com", "fbasics.com", "frebasics.com", "frebasics.net", "frebasics.org", "frebasik.com", "frebasik.net", "frebasik.org", "frebasiks.com", "frebasiks.net", "frebasiks.org", "frebasix.com", "frebasix.net", "frebasix.org", "freeb.com", "freeb6.com", "freebasic.com", "freebasicinternet.com", "freebasicnet.com", "freebasics.com", "freebasicservices.com", "freebasik.com", "freebasik.net", "freebasik.org", "freebasiks.com", "freebasiks.net", "freebasiks.org", "freebasix.com", "freebasixs.com", "freebs.com", "i.org", "internet.org", "internetdefenseprize.com", "internetdefenseprize.org",
  // Facebook Developer
  "1ccountkit.com", "2ccountkit.com", "accluntkit.com", "accountkit.com", "applinks.org", "atscaleconference.com", "f8.com", "facebook-start.com", "facebookanalytics.com", "facebookdeveloper.com", "facebookdeveloperfaq.com", "facebookdevelopergarage.com", "facebookdevelopers.com", "facebookdevelopers.com", "facebookdevelopment.com", "fbanalytics.com", "fblint.com", "fblint.net", "fblint.org", "fbstart.com", "fbworkmail.com", "hackerfacebook.com", "hackfacebook.com", "messengerblog.com", "messengerdevelopers.com", "oglint.com", "oglint.net", "oglint.org", "ogp.me", "opencompute.com", "opencompute.net", "opengraphprotocol.com", "opengraphprotocol.org", "techprep.net", "techprep.org",
  // Facebook Open Source
  "asyncdisplaykit.com", "asyncdisplaykit.net", "asyncdisplaykit.org", "bistro.io", "buck.build", "buckbuild.com", "caffe2.ai", "caffe2.github.io", "componentkit.org", "docusaurus.io", "draftjs.org", "facebook.github.io", "facebookincubator.github.io", "facebookmicrosites.github.io", "facebookresearch.github.io", "fasttext.cc", "fbflipper.com", "fbflipper.com", "fbinfer.com", "fbinfer.com", "fblitho.com", "fbredex.com", "fbsamples.github.io", "flow.org", "flowtype.org", "frescolib.org", "graphql.github.io", "graphql.org", "hacklang.org", "hermesengine.dev", "hhvm.com", "instagram.github.io", "jestjs.io", "libspectrum.io", "libspectrum.io", "makeitopen.com", "mcrouter.net", "myrocks.io", "nuclide.io", "onnx.ai", "onnx.github.io", "osquery.io", "prepack.io", "prestodb.github.io", "pybowler.io", "pyre-check.org", "pytorch.github.io", "pytorch.org", "reactjs.org", "reasonml.github.io", "rocksdb.com", "rocksdb.net", "rocksdb.org", "texturegroup.github.io", "texturegroup.org", "torchcraft.github.io", "yogalayout.com",
  // Facebook Buisness
  "atdmt-host.com", "atdmt-ppe.com", "atdmt2.com", "atlas-search.com", "atlas-search.net", "atlas1point.com", "atlasdirect.com", "atlasdmt.com", "atlasgo.com", "atlasin-stream.com", "atlasin-streamvideo.com", "atlasinstitute.com", "atlasinstream.com", "atlasinstreamvideo.com", "atlasolution.com", "atlasonepoint.com", "atlaspublisher.com", "atlasrichmedia.co.uk", "atlasrichmedia.com", "atlasrichmedia.eu", "atlassearch.com", "atlassearch.eu", "atlassiteoptimization.com", "atlassolutions.co.uk", "atlassolutions.com", "atlassolutions.com.au", "atlassolutions2.com", "campaignoptimizer.com", "click-url.ca", "click-url.com", "drvmx.com", "emapping.tv", "emapping.tv", "engagementmap.net", "engagementmap.tv", "engagementroi.net", "engagementroi.tv", "everytouchpoint.com", "everytouchpoint.net", "everytouchpoint.tv", "facebook-pmd.com", "facebook-pmdcenter.com", "facebook-pmdcenter.net", "facebook-pmdcenter.org", "facebook-pmdcentre.com", "facebook-studio.com", "facebook-studio.org", "facebook-studios.net", "facebook-studios.org", "facebookbusiness.com", "facebookmarketingpartner.com", "facebookmarketingpartner.net", "facebookmarketingpartner.org", "facebookmarketingpartners.com", "facebookmarketingpartners.net", "facebookmarketingpartners.org", "facebookpmd.com", "facebookpmdcenter.com", "facebookpmdcenter.net", "facebookpmdcenter.org", "facebookpmdcentre.com", "fb.biz", "fbinnovation.com", "fbmarketing.com", "flashmtk.com", "gotoast.com", "instagrammarketingpartner.com", "instagrammarketingpartner.net", "instagrammarketingpartner.org", "instagrammarketingpartners.com", "instagrammarketingpartners.net", "instagrammarketingpartners.org", "instagrampartner.com", "instagrampartner.net", "instagrampartner.org", "instagrampartners.com", "instagrampartners.net", "instagrampartners.org", "lifecycle-email.com", "liverailplayer.com", "liverailplayer.net", "liverailplayer.org", "onepoint.com", "online-deals.net", "partnerforresults.com", "pmd-center.com", "pmd-directory.com", "precision-email.com", "reachtheworldonfacebook.com", "roiservice.com", "toplayerserver.com",
  // Fake Likes
  "acebookfans.com", "alotmorefans.com", "alotoffans.com", "bestfacebookfans.com", "buyfacebookfansonline.com", "buyfacebookfansonline.net", "buyfacebookfanssite.com", "buyfb-fans.com", "buyfbfanslikes.com", "buyfbfansnow.com", "buyfbfansonline.com", "buyingfacebooklikes.com", "buyrealfbfans.net", "facebookfanpageclass.com", "facebookfanpagewebinar.com", "facebooklikeexchange.com", "facebooklikeexchange.us", "faceebot.com", "freefbfans.com", "freefblikes.com", "getfacebooklikes.com", "getfastfacebookfans.com", "getfblikesnow.com", "getlikesfacebook.com", "getmefansnow.com", "getrealfans.org", "instaadder.com", "instafollower.com", "learnfacebookfanpages.com", "lotmorefans.com", "morefansneeded.com", "morefanstoday.com", "morefollowerstoday.com", "muchmorefans.com", "muchmorefollowers.com", "myfbfans.com", "plusdefans.com", "purefacebookfans.com", "real-fans.org", "realfacebookfans.org",
  // Redirect: Facebook Services
  "facebookcreate.com", "facebookgameroom.com", "facebookgameroom.net", "facebookgameroom.org", "facebookgroups.com", "facebooklive.com", "facebooknews.com", "facebooknewsroom.com", "facebookstories.com", "fbgameroom.com", "fbgameroom.net", "fbgameroom.org", "gameroom.com", "momentsapp.com",
  // Redirect: Messenger.com
  "facbookmessenger.com", "facebookmesenger.com", "facebookmessagesite.com", "facebookmessanger.com", "facebookmessenger.com", "facebookmessinger.com", "faceboomessenger.com", "fbmessages.com", "fbmessenger.com", "msgr.co", "msgr.it",
  // Redirect: Instagram.com
  "instafashionist.com", "instagr.am", "instagram.mobi", "instagram.org", "instagramz.com", "instagrm.com", "instameet.com", "instameetbeta.com", "instameeting.com", "instameetings.com", "instameets.com", "instameetup.com", "instameetups.com", "instgra.com", "letsinstameet.com", "oninstagram.com", "online-instagram.com", "winstagram.com", "wwinstagram.com", "wwwinstagram.com",
  // Redirect: Facebook.com
  "2cthefacebook.com", "acebok.com", "acebooik.com", "acebook.com", "acebookfriends.com", "acfebook.com", "afcbook.com", "afcecbook.com", "aintfacebook.com", "as63293.com", "as63293.net", "as63293.org", "cacevook.com", "dacebook.com", "dacecbook.com", "de-defacebook.com", "dfacecbook.com", "faacebok.com", "faacebook.com", "faasbook.com", "faboock.com", "facaboock.com", "facbebook.com", "facbeok.com", "facbeooik.com", "facboo.com", "facbook.com", "facbool.com", "facboox.com", "facbouk.com", "faccebook.com", "faccebookk.com", "facdbook.com", "facdebook.com", "facdook.com", "face-book.com", "face3book.com", "faceabook.com", "facebboc.com", "facebbook.com", "facebboook.com", "facebcook.com", "facebcook.org", "facebdok.com", "facebgook.com", "facebhook.com", "facebiil.com", "facebiooik.com", "facebkkk.com", "facebnooik.com", "facebo0oik.com", "faceboak.com", "facebocke.com", "facebof.com", "facebohok.com", "faceboik.com", "faceboiki.com", "facebok.com", "facebokbook.com", "facebokc.com", "facebokcasino.com", "facebokk.com", "facebokok.com", "faceboks.com", "facebol.com", "facebolk.com", "facebomok.com", "faceboo.com", "facebooa.com", "faceboob.com", "faceboobok.com", "facebooc.com", "faceboock.com", "facebood.com", "facebooe.com", "faceboof.com", "facebooi.com", "facebooich.com", "facebooick.com", "facebooiik.com", "facebooik.com", "facebooik.org", "facebooj.com", "facebook-mail.com", "facebook30.com", "facebook30.net", "facebook30.org", "facebookatschool.com", "facebookck.com", "facebookcom.com", "facebookdealers.org", "facebookemail.com", "facebookfacebook.com", "facebookflex.com", "facebookflex.net", "facebookflex.org", "facebookflow.com", "facebooki.com", "facebookkcredits.com", "facebookmobile.com", "facebookmobile.mobi", "facebookmsn.com", "facebooknotify.com", "facebooknotify.net", "facebooknotify.org", "facebookook.com", "facebooks.com", "facebookshop.com", "facebooksignup.net", "facebookstuff.com", "facebookstuff.net", "facebool.com", "facebool.com", "facebool.info", "facebooll.com", "faceboom.com", "faceboon.com", "faceboonk.com", "faceboooik.com", "faceboook.com", "facebooon.com", "facebooor.com", "faceboop.com", "faceboork.com", "faceboot.com", "facebooth.com", "facebootk.com", "faceboow.com", "faceboox.com", "faceboozk.com", "facebopk.com", "facebopoik.com", "facebpook.com", "facebuok.com", "facebvooik.com", "facebvook.com", "facebxook.com", "facebyook.com", "facebzook.com", "facecbgook.com", "facecboik.com", "facecboock.com", "facecbooi.com", "facecbooj.com", "facecbook.com", "facecbook.info", "facecbook.org", "facecbookk.com", "facecbookm.com", "facecboom.com", "facecbooo.com", "facecgook.com", "facecook.com", "facedbook.com", "faceebok.com", "faceebook.com", "faceecbook.com", "facefoock.com", "facegbok.com", "facegbook.com", "facegvook.com", "facelbook.com", "faceobk.com", "faceobok.com", "faceobook.com", "faceook.com", "facepok.com", "faceqbook.com", "facerbooik.com", "facerbook.com", "facesbooc.com", "facesboock.com", "facesounds.com", "facetook.com", "facevbooik.com", "facevbook.com", "facevkook.com", "facevlook.com", "facevoik.com", "facevooi.com", "facevooik.com", "facevoolk.com", "facewook.com", "facfacebook.com", "facfebook.com", "fackbock.com", "fackebook.com", "facnbook.com", "facrbook.com", "facvebook.com", "facwebooik.com", "facwebook.com", "facwecbook.com", "facxebooik.com", "facxebook.com", "fadebook.com", "faebok.com", "faebooik.com", "faebook.com", "faebookc.com", "faeboook.com", "faecebok.com", "faesbuk.com", "faesebook.com", "fafacebook.com", "faicbooc.com", "fasebokk.com", "faseboock.com", "fasebook.com", "faseboot.com", "faseboox.com", "fasedook.com", "fastfacebookproxy.com", "faucebook.com", "favbeook.com", "favcebook.com", "faveb0ok.com", "favebgook.com", "favebo0k.com", "faveboik.com", "faveboko.com", "favebooi.com", "favebook.com", "favebooo.com", "favebpok.com", "favegbook.com", "favegook.com", "favehook.com", "favenool.com", "faveobok.com", "faxcebool.com", "faxehook.com", "faycbok.com", "fazacebook.com", "fbacebook.com", "fbdownloader.com", "fbfund.com", "fbinc.com", "fbside.com", "fbwins.info", "fcacebook.com", "fcaebbok.com", "fcaebook.com", "fcebook.com", "fcebookk.com", "fcfacebook.com", "fdacebook.info", "fdacecbook.com", "feacboo.com", "feacbook.com", "feacbooke.com", "feacebook.com", "fecabo.com", "fecabooik.com", "fecacbook.com", "fecacook.com", "fecavook.com", "fecbbok.com", "fecbooc.com", "fecbook.com", "feceboock.com", "fecebook.net", "feceboox.com", "fececbook.com", "fecepook.com", "fecoobok.com", "feecook.com", "feook.com", "ferabook.com", "fescebook.com", "fesebook.com", "fevabooik.com", "fevabook.com", "fevecbook.com", "fexbok.com", "feybook.com", "ffacebook.com", "ffacecbook.com", "ffbymail.com", "ffbymale.com", "fgacebook.com", "fgacecbook.com", "fgcebook.com", "ficeboock.com", "fmcebook.com", "fnacebook.com", "focabok.com", "fosebook.com", "fpacebook.com", "fqcebook.com", "fracebooik.com", "fracecbook.com", "freeefacebook.com", "freeefacebook.net", "freeefacebook.org", "freefacebook.net", "freefaceboook.com", "freefaceboook.net", "freefaceboook.org", "frefacebook.com", "frefacebook.net", "frefacebook.org", "freindfeed-inc.com", "freindfeed.com", "frendfeed.com", "friendbook.info", "friendfead.com", "friendfed.com", "friendfeed-api.com", "friendfeed-inc.com", "friendfeed-media.com", "friendfeed.com", "friendfeedapi.com", "friendfeeders.com", "friendfeeding.com", "friendfeedmedia.com", "friendfeedmobile.com", "friendfeeds.com", "friendpheed.com", "frinedfeed.com", "fsacebok.com", "fscebook.com", "fscenook.com", "fscobook.com", "funnyfacebook.org", "fvaebook.com", "fwacebok.com", "gacebook.com", "gacecbook.com", "gfacecbook.com", "hifacebook.info", "hsfacebook.com", "httpfacebook.com", "httpsfacebook.com", "httpwwwfacebook.com", "lfacebook.com", "mail2ff.com", "mobilefacebook.com", "newsfeed.com", "nextstop.com", "nextstopper.com", "proxyfacebook.org", "shopfacebook.net", "sportsfacebook.com", "tfbworknw.com", "tfbworknw.net", "tfbworknw.org", "thefacebook.com", "unblock2facebook.info", "westmentors.org", "www-facebook.com", "wwwfacebok.com", "wwwfacebok.com", "wwwfacebook.com", "wwwfacebook.com", "wwwmfacebook.com",
  // Placeholder or Defunct Services
  "faceb.us", "facebook-domain-names.com", "facebook-inc.com", "facebook-login.com", "facebook-marketplace.com", "facebookappmail.com", "facebookcannes2015.com", "facebookdownloader.com", "facebookembed.com", "facebookfarmersmarket.com", "facebookfarmersmarket.net", "facebookfarmersmarket.org", "facebookformobileoperators.com", "facebookhome.ca", "facebookhome.cl", "facebookhome.co", "facebookhome.co.in", "facebookhome.co.uk", "facebookhome.co.za", "facebookhome.com", "facebookhome.com.cn", "facebookhome.com.es", "facebookhome.de", "facebookhome.es", "facebookhome.fr", "facebookhome.info", "facebookhome.jp", "facebookhome.me", "facebookhome.nl", "facebookhome.ru", "facebookhome.us", "facebookinc.com", "facebookinsightsdata.com", "facebooklogin.com", "facebooklogin.info", "facebooklogin.mobi", "facebookmx.com", "facebookproxy.com", "facebooksuppliers.com", "facebooksupplierstest.com", "facebookvrtour.com", "fb-ops.com", "fb.co", "fbdocs.com", "fbfarmersmarket.com", "fbfarmersmarket.net", "fbfarmersmarket.org", "fbfeedback.com", "fbhome.cl", "fbhome.cn", "fbhome.co", "fbhome.co.in", "fbhome.co.uk", "fbhome.co.za", "fbhome.com", "fbhome.com.cn", "fbhome.com.es", "fbhome.es", "fbhome.fr", "fbhome.in", "fbhome.jp", "fbhome.me", "fbhome.nl", "fbhome.us", "fbook.mobi", "fbookmobile.com", "fbops.com", "fbplugin.com", "fbquestions.com", "fbquestions.net", "fbquestions.org", "fplug.io", "fquestions.com", "fquestions.net", "fquestions.org", "gompk.com", "moochspot.com", "neko-dev.com", "somethingtoputhere.com", "tellfacebook.com", "tfbops.com", "thefacebook.at", "thefacebook.de", "thefacebook.net", "whyfacebook.com", "worldhack.com"
]; 

const MAC_ADDON_ID = "@testpilot-containers";

let macAddonEnabled = false;
let facebookCookieStoreId = null;

// TODO: refactor canceledRequests and tabsWaitingToLoad into tabStates
const canceledRequests = {};
const tabsWaitingToLoad = {};
const tabStates = {};

const facebookHostREs = [];

async function isMACAddonEnabled () {
  try {
    const macAddonInfo = await browser.management.get(MAC_ADDON_ID);
    if (macAddonInfo.enabled) {
      sendJailedDomainsToMAC();
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function setupMACAddonListeners () {
  browser.runtime.onMessageExternal.addListener((message, sender) => {
    if (sender.id !== "@testpilot-containers") {
      return;
    }
    switch (message.method) {
    case "MACListening":
      sendJailedDomainsToMAC();
      break;
    }
  });
  function disabledExtension (info) {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
  }
  function enabledExtension (info) {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
  }
  browser.management.onInstalled.addListener(enabledExtension);
  browser.management.onEnabled.addListener(enabledExtension);
  browser.management.onUninstalled.addListener(disabledExtension);
  browser.management.onDisabled.addListener(disabledExtension);
}

async function sendJailedDomainsToMAC () {
  try {
    return await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "jailedDomains",
      urls: FACEBOOK_DOMAINS.map((domain) => {
        return `https://${domain}/`;
      })
    });
  } catch (e) {
    // We likely might want to handle this case: https://github.com/mozilla/contain-facebook/issues/113#issuecomment-380444165
    return false;
  }
}

async function getMACAssignment (url) {
  if (!macAddonEnabled) {
    return false;
  }

  try {
    const assignment = await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "getAssignment",
      url
    });
    return assignment;
  } catch (e) {
    return false;
  }
}

function cancelRequest (tab, options) {
  // we decided to cancel the request at this point, register canceled request
  canceledRequests[tab.id] = {
    requestIds: {
      [options.requestId]: true
    },
    urls: {
      [options.url]: true
    }
  };

  // since webRequest onCompleted and onErrorOccurred are not 100% reliable
  // we register a timer here to cleanup canceled requests, just to make sure we don't
  // end up in a situation where certain urls in a tab.id stay canceled
  setTimeout(() => {
    if (canceledRequests[tab.id]) {
      delete canceledRequests[tab.id];
    }
  }, 2000);
}

function shouldCancelEarly (tab, options) {
  // we decided to cancel the request at this point
  if (!canceledRequests[tab.id]) {
    cancelRequest(tab, options);
  } else {
    let cancelEarly = false;
    if (canceledRequests[tab.id].requestIds[options.requestId] ||
        canceledRequests[tab.id].urls[options.url]) {
      // same requestId or url from the same tab
      // this is a redirect that we have to cancel early to prevent opening two tabs
      cancelEarly = true;
    }
    // register this requestId and url as canceled too
    canceledRequests[tab.id].requestIds[options.requestId] = true;
    canceledRequests[tab.id].urls[options.url] = true;
    if (cancelEarly) {
      return true;
    }
  }
  return false;
}

function generateFacebookHostREs () {
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    facebookHostREs.push(new RegExp(`^(.*\\.)?${facebookDomain}$`));
  }
}

async function clearFacebookCookies () {
  // Clear all facebook cookies
  const containers = await browser.contextualIdentities.query({});
  containers.push({
    cookieStoreId: "firefox-default"
  });

  let macAssignments = [];
  if (macAddonEnabled) {
    const promises = FACEBOOK_DOMAINS.map(async facebookDomain => {
      const assigned = await getMACAssignment(`https://${facebookDomain}/`);
      return assigned ? facebookDomain : null;
    });
    macAssignments = await Promise.all(promises);
  }

  FACEBOOK_DOMAINS.map(async facebookDomain => {
    const facebookCookieUrl = `https://${facebookDomain}/`;

    // dont clear cookies for facebookDomain if mac assigned (with or without www.)
    if (macAddonEnabled &&
        (macAssignments.includes(facebookDomain) ||
         macAssignments.includes(`www.${facebookDomain}`))) {
      return;
    }

    containers.map(async container => {
      const storeId = container.cookieStoreId;
      if (storeId === facebookCookieStoreId) {
        // Don't clear cookies in the Facebook Container
        return;
      }

      const cookies = await browser.cookies.getAll({
        domain: facebookDomain,
        storeId
      });

      cookies.map(cookie => {
        browser.cookies.remove({
          name: cookie.name,
          url: facebookCookieUrl,
          storeId
        });
      });
      // Also clear Service Workers as it breaks detecting onBeforeRequest
      await browser.browsingData.remove({hostnames: [facebookDomain]}, {serviceWorkers: true});
    });
  });
}

async function setupContainer () {
  // Use existing Facebook container, or create one

  const info = await browser.runtime.getBrowserInfo();
  if (parseInt(info.version) < 67) {
    FACEBOOK_CONTAINER_DETAILS.color = "blue";
    FACEBOOK_CONTAINER_DETAILS.icon = "briefcase";
  }

  const contexts = await browser.contextualIdentities.query({name: FACEBOOK_CONTAINER_DETAILS.name});
  if (contexts.length > 0) {
    const facebookContext = contexts[0];
    facebookCookieStoreId = facebookContext.cookieStoreId;
    // Make existing Facebook container the "fence" icon if needed
    if (facebookContext.color !== FACEBOOK_CONTAINER_DETAILS.color ||
        facebookContext.icon !== FACEBOOK_CONTAINER_DETAILS.icon
    ) {
      await browser.contextualIdentities.update(
        facebookCookieStoreId,
        { color: FACEBOOK_CONTAINER_DETAILS.color, icon: FACEBOOK_CONTAINER_DETAILS.icon }
      );
    }
  } else {
    const context = await browser.contextualIdentities.create(FACEBOOK_CONTAINER_DETAILS);
    facebookCookieStoreId = context.cookieStoreId;
  }
  // Initialize domainsAddedToFacebookContainer if needed
  const fbcStorage = await browser.storage.local.get();
  if (!fbcStorage.domainsAddedToFacebookContainer) {
    await browser.storage.local.set({"domainsAddedToFacebookContainer": []});
  }
}

async function maybeReopenTab (url, tab, request) {
  const macAssigned = await getMACAssignment(url);
  if (macAssigned) {
    // We don't reopen MAC assigned urls
    return;
  }
  const cookieStoreId = await shouldContainInto(url, tab);
  if (!cookieStoreId) {
    // Tab doesn't need to be contained
    return;
  }

  if (request && shouldCancelEarly(tab, request)) {
    // We need to cancel early to prevent multiple reopenings
    return {cancel: true};
  }

  await browser.tabs.create({
    url,
    cookieStoreId,
    active: tab.active,
    index: tab.index,
    windowId: tab.windowId
  });
  browser.tabs.remove(tab.id);

  return {cancel: true};
}

function isFacebookURL (url) {
  const parsedUrl = new URL(url);
  for (let facebookHostRE of facebookHostREs) {
    if (facebookHostRE.test(parsedUrl.host)) {
      return true;
    }
  }
  return false;
}

// TODO: Consider users if accounts.spotify.com already in FBC
async function supportSiteSubdomainCheck (url) {
  if (url === "accounts.spotify.com") {
    await addDomainToFacebookContainer("https://www.spotify.com");
    await addDomainToFacebookContainer("https://open.spotify.com");
  }
  return;
}

// TODO: refactor parsedUrl "up" so new URL doesn't have to be called so much
// TODO: refactor fbcStorage "up" so browser.storage.local.get doesn't have to be called so much
async function addDomainToFacebookContainer (url) {
  const parsedUrl = new URL(url);
  const fbcStorage = await browser.storage.local.get();
  fbcStorage.domainsAddedToFacebookContainer.push(parsedUrl.host);
  await browser.storage.local.set({"domainsAddedToFacebookContainer": fbcStorage.domainsAddedToFacebookContainer});
  await supportSiteSubdomainCheck(parsedUrl.host);
}

async function removeDomainFromFacebookContainer (domain) {
  const fbcStorage = await browser.storage.local.get();
  const domainIndex = fbcStorage.domainsAddedToFacebookContainer.indexOf(domain);
  fbcStorage.domainsAddedToFacebookContainer.splice(domainIndex, 1);
  await browser.storage.local.set({"domainsAddedToFacebookContainer": fbcStorage.domainsAddedToFacebookContainer});
}

// TODO: Add PSL Subdomain Check against current list
async function isAddedToFacebookContainer (url) {
  const parsedUrl = new URL(url);
  const fbcStorage = await browser.storage.local.get();
  if (fbcStorage.domainsAddedToFacebookContainer.includes(parsedUrl.host)) {
    return true;
  }
  return false;
}

async function shouldContainInto (url, tab) {
  if (!url.startsWith("http")) {
    // we only handle URLs starting with http(s)
    return false;
  }

  const hasBeenAddedToFacebookContainer = await isAddedToFacebookContainer(url);

  if (isFacebookURL(url) || hasBeenAddedToFacebookContainer) {
    if (tab.cookieStoreId !== facebookCookieStoreId) {
      // Facebook-URL outside of Facebook Container Tab
      // Should contain into Facebook Container
      return facebookCookieStoreId;
    }
  } else if (tab.cookieStoreId === facebookCookieStoreId) {
    // Non-Facebook-URL inside Facebook Container Tab
    // Should contain into Default Container
    return "firefox-default";
  }

  return false;
}

async function maybeReopenAlreadyOpenTabs () {
  const tabsOnUpdated = (tabId, changeInfo, tab) => {
    if (changeInfo.url && tabsWaitingToLoad[tabId]) {
      // Tab we're waiting for switched it's url, maybe we reopen
      delete tabsWaitingToLoad[tabId];
      maybeReopenTab(tab.url, tab);
    }
    if (tab.status === "complete" && tabsWaitingToLoad[tabId]) {
      // Tab we're waiting for completed loading
      delete tabsWaitingToLoad[tabId];
    }
    if (!Object.keys(tabsWaitingToLoad).length) {
      // We're done waiting for tabs to load, remove event listener
      browser.tabs.onUpdated.removeListener(tabsOnUpdated);
    }
  };

  // Query for already open Tabs
  const tabs = await browser.tabs.query({});
  tabs.map(async tab => {
    if (tab.incognito) {
      return;
    }
    if (tab.url === "about:blank") {
      if (tab.status !== "loading") {
        return;
      }
      // about:blank Tab is still loading, so we indicate that we wait for it to load
      // and register the event listener if we haven't yet.
      //
      // This is a workaround until platform support is implemented:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1447551
      // https://github.com/mozilla/multi-account-containers/issues/474
      tabsWaitingToLoad[tab.id] = true;
      if (!browser.tabs.onUpdated.hasListener(tabsOnUpdated)) {
        browser.tabs.onUpdated.addListener(tabsOnUpdated);
      }
    } else {
      // Tab already has an url, maybe we reopen
      maybeReopenTab(tab.url, tab);
    }
  });
}

function stripFbclid(url) {
  const strippedUrl = new URL(url);
  strippedUrl.searchParams.delete("fbclid");
  return strippedUrl.href;
}

async function getActiveTab () {
  const [activeTab] = await browser.tabs.query({currentWindow: true, active: true});
  return activeTab;
}

async function windowFocusChangedListener (windowId) {
  if (windowId !== browser.windows.WINDOW_ID_NONE) {
    const activeTab = await getActiveTab();
    updateBrowserActionIcon(activeTab);
  }
}

function tabUpdateListener (tabId, changeInfo, tab) {
  updateBrowserActionIcon(tab);
}

/*
async function areAllStringsTranslated () {
  const browserUILanguage = browser.i18n.getUILanguage();
  if (browserUILanguage && browserUILanguage.startsWith("en")) {
    return true;
  }
  const enMessagesPath = browser.extension.getURL("_locales/en/messages.json");
  const resp = await fetch(enMessagesPath);
  const enMessages = await resp.json();

  // TODO: Check Pontoon for available translations instead of checking
  // messages files
  for (const key of Object.keys(enMessages)){
    // TODO: this doesn't check if the add-on messages are translated into
    // any other browser.i18n.getAcceptedLanguages() options ... but then,
    // I don't think browser.i18n let's us get messages in anything but the
    // primary language anyway? Does browser.i18n.getMessage automatically
    // check for secondary languages?
    const enMessage = enMessages[key].message;
    const translatedMessage = browser.i18n.getMessage(key);
    if (translatedMessage == enMessage) {
      return false;
    }
  }
  return true;
}
*/

async function updateBrowserActionIcon (tab) {

  browser.browserAction.setBadgeText({text: ""});

  if (tab.incognito) {
    browser.browserAction.disable(tab.id);
    return;
  }

  const url = tab.url;
  const hasBeenAddedToFacebookContainer = await isAddedToFacebookContainer(url);



  if (isFacebookURL(url)) {
    // TODO: change panel logic from browser.storage to browser.runtime.onMessage
    // so the panel.js can "ask" background.js which panel it should show
    browser.storage.local.set({"CURRENT_PANEL": "on-facebook"});
    browser.browserAction.setPopup({tabId: tab.id, popup: "./panel.html"});
  } else if (hasBeenAddedToFacebookContainer) {
    browser.storage.local.set({"CURRENT_PANEL": "in-fbc"});
  } else {
    const tabState = tabStates[tab.id];
    const panelToShow = (tabState && tabState.trackersDetected) ? "trackers-detected" : "no-trackers";
    browser.storage.local.set({"CURRENT_PANEL": panelToShow});
    browser.browserAction.setPopup({tabId: tab.id, popup: "./panel.html"});
    browser.browserAction.setBadgeBackgroundColor({color: "#6200A4"});
    if ( panelToShow === "trackers-detected" ) {
      browser.browserAction.setBadgeText({text: "!"});
    }
  }
}

async function containFacebook (request) {
  if (tabsWaitingToLoad[request.tabId]) {
    // Cleanup just to make sure we don't get a race-condition with startup reopening
    delete tabsWaitingToLoad[request.tabId];
  }

  const tab = await browser.tabs.get(request.tabId);
  updateBrowserActionIcon(tab);

  const url = new URL(request.url);
  const urlSearchParm = new URLSearchParams(url.search);
  if (urlSearchParm.has("fbclid")) {
    return {redirectUrl: stripFbclid(request.url)};
  }
  // Listen to requests and open Facebook into its Container,
  // open other sites into the default tab context
  if (request.tabId === -1) {
    // Request doesn't belong to a tab
    return;
  }

  if (tab.incognito) {
    // We don't handle incognito tabs
    return;
  }

  return maybeReopenTab(request.url, tab, request);
}

// Lots of this is borrowed from old blok code:
// https://github.com/mozilla/blok/blob/master/src/js/background.js
async function blockFacebookSubResources (requestDetails) {
  if (requestDetails.type === "main_frame") {
    return {};
  }

  if (typeof requestDetails.originUrl === "undefined") {
    return {};
  }

  const urlIsFacebook = isFacebookURL(requestDetails.url);
  const originUrlIsFacebook = isFacebookURL(requestDetails.originUrl);

  if (!urlIsFacebook) {
    return {};
  }

  if (originUrlIsFacebook) {
    const message = {msg: "facebook-domain"};
    // Send the message to the content_script
    browser.tabs.sendMessage(requestDetails.tabId, message);
    return {};
  }

  const hasBeenAddedToFacebookContainer = await isAddedToFacebookContainer(requestDetails.originUrl);

  if ( urlIsFacebook && !originUrlIsFacebook ) {
    if (!hasBeenAddedToFacebookContainer ) {
      const message = {msg: "blocked-facebook-subresources"};
      // Send the message to the content_script
      browser.tabs.sendMessage(requestDetails.tabId, message);

      tabStates[requestDetails.tabId] = { trackersDetected: true };
      return {cancel: true};
    } else {
      const message = {msg: "allowed-facebook-subresources"};
      // Send the message to the content_script
      browser.tabs.sendMessage(requestDetails.tabId, message);
      return {};
    }
  }
  return {};
}

function setupWebRequestListeners() {
  browser.webRequest.onCompleted.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});
  browser.webRequest.onErrorOccurred.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});

  // Add the main_frame request listener
  browser.webRequest.onBeforeRequest.addListener(containFacebook, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

  // Add the sub-resource request listener
  browser.webRequest.onBeforeRequest.addListener(blockFacebookSubResources, {urls: ["<all_urls>"]}, ["blocking"]);
}

function setupWindowsAndTabsListeners() {
  browser.tabs.onUpdated.addListener(tabUpdateListener);
  browser.tabs.onRemoved.addListener(tabId => delete tabStates[tabId] );
  browser.windows.onFocusChanged.addListener(windowFocusChangedListener);
}

(async function init () {
  await setupMACAddonListeners();
  macAddonEnabled = await isMACAddonEnabled();

  try {
    await setupContainer();
  } catch (error) {
    // TODO: Needs backup strategy
    // See https://github.com/mozilla/contain-facebook/issues/23
    // Sometimes this add-on is installed but doesn't get a facebookCookieStoreId ?
    // eslint-disable-next-line no-console
    console.error(error);
    return;
  }
  clearFacebookCookies();
  generateFacebookHostREs();
  setupWebRequestListeners();
  setupWindowsAndTabsListeners();

  browser.runtime.onMessage.addListener( (message, {url}) => {
    if (message === "what-sites-are-added") {
      return browser.storage.local.get().then(fbcStorage => fbcStorage.domainsAddedToFacebookContainer);
    } else if (message.removeDomain) {
      removeDomainFromFacebookContainer(message.removeDomain).then( results => results );
    } else {
      addDomainToFacebookContainer(url).then( results => results);
    }
  });

  maybeReopenAlreadyOpenTabs();

  const activeTab = await getActiveTab();
  updateBrowserActionIcon(activeTab);
})();
