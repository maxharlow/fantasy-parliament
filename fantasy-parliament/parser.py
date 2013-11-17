from urllib2 import urlopen
from datetime import datetime, timedelta
from lxml import etree
# from pymongo import MongoClient

# HOST='localhost'
# PORT='27017'
# DB_NAME='Global'

# client=MongoClient(HOST, PORT)
# db=client[DB_NAME]

PP_URL='http://ukparse.kforge.net/parldata/scrapedxml/debates/'

class Parser(object):

    def __init__(self, start_year, start_month, start_day):
        self.start='%d-%d-%d' % (start_year, start_month, start_day)
        self.voting={} #matches speaker with list of vote objects
        self.speak={} #matches speaker with list of speech url
        self.divisions={} #matches url with ayes, noes
        now_date=datetime.strptime(self.start, '%Y-%m-%d')
        for delta in xrange(1,7):
            date_string=now_date.strftime('%Y-%m-%d')
            for i in ['a', 'b', 'c']:
                xml_name=PP_URL+ 'debates'+ date_string + i + '.xml'
                try:
                    foo=urlopen(xml_name).read()
                    print('Opened debate: ' + xml_name)
                except:
                    continue
            self.voting, self.speak, self.divisions=search_division(foo, self.voting, self.speak, self.divisions,date_string)
            now_date=now_date + timedelta(days=1)

    def vote_score(self, id):
        print 'vs '+str(id)
        results = []
        if id in self.voting:
            for vote in self.voting[id]:
                results.append({'description': 'voted', 'score': 1})
        else:
            results.append({'description': 'never voted', 'score': -3})
        return results

    def speak_score(self, id):
        results = []
        if id in self.speak:
            count=len(self.speak[id])
            results.append({'description': 'spoke', 'score': count})
        return results
        

        
def search_division(xml_string, voting, speak, division_dict, datestr):
    def add_vote(a_mp, a_div_url, a_type, a_maj):
        mp_id=a_mp.get('id')[-5:]
        tmp={}
        tmp['date']=datestr
        tmp['div_url']=a_div_url
        tmp['vote_type']=a_type
        if type==a_maj:
            tmp['min-maj']='Majority'
        else:
            tmp['min-maj']='Minority'
        
        if mp_id in voting:
            voting[mp_id].append(tmp)
        else:
            voting[mp_id]=[tmp]
    
    def add_division(a_div_url, num_ayes, num_noes):
        div_id=a_div_url.split('_')[1]
        if div_id not in division_dict:
            tmp={}
            tmp['url']=a_div_url
            tmp['date']=datestr
            tmp['ayes']=num_ayes
            tmp['noes']=num_noes     
            
            division_dict[div_id]=tmp
                
            
    def add_speech(a_speech):
        if not a_speech.get('nospeaker'):
            speaker_id=a_speech.get('speakerid')[-5:]
            speech_id=a_speech.get('url')
            if speaker_id in speak:
                speak[speaker_id].append(speech_id)
            else:
                speak[speaker_id]=[speech_id]
                
                
    root=etree.fromstring(xml_string)
    
    division_list=root.findall('division')
    for division in division_list:
        div_url=division.get('url')
        div_count=division.find('divisioncount')
        ayes=div_count.get('ayes')
        noes=div_count.get('noes')
        if ayes>noes:
            major='aye'
        else:
            major='no'
            
        add_division(div_url,ayes,noes)
        
        for mplist in division.findall('mplist'):
            vote_type=mplist.get('vote')
            for mp in mplist.iterchildren():
                add_vote(mp, div_url, vote_type, major)

                
                
    speech_list=root.findall('speech')
    for speech in speech_list:
        add_speech(speech)
    
    return voting, speak, division_dict

Q=Parser(2013,11,5)