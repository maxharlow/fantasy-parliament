from urllib2 import urlopen
from datetime import datetime, timedelta, date as dt
from lxml import etree
# from pymongo import MongoClient

# HOST='localhost'
# PORT='27017'
# DB_NAME='Global'

# client=MongoClient(HOST, PORT)
# db=client[DB_NAME]

PP_URL='http://ukparse.kforge.net/parldata/scrapedxml/debates/'

class Parser(object):
    def __init__(self):
        
        now_date=dt.today()
        self.start=now_date.strftime('%Y-%m-%d')
        self.voting={} #matches speaker with list of vote objects
        self.speak={} #matches speaker with list of speech url
        self.divisions={} #matches url with ayes, noes
        
        for delta in xrange(1,8):
            date_string=now_date.strftime('%Y-%m-%d')
            for i in ['a', 'b', 'c']:
                xml_name=PP_URL+ 'debates'+ date_string + i + '.xml'
                try:
                    foo=urlopen(xml_name).read()
                    print('Opened debate: ' + xml_name)
                    self.voting, self.speak, self.divisions=search_division(foo, self.voting, self.speak, self.divisions,date_string)
                except:
                    continue

            now_date=now_date - timedelta(days=1)

    def vote_score(self, member_id):
        member_id = str(member_id)
        print 'vs '+ member_id
        results = []
        for division_id in self.divisions:
            division = self.divisions[division_id]
            if member_id in self.voting and division_id in self.voting[member_id]:
                vote = self.voting[member_id][division_id]
                desc = 'voted <b class="vote">' + vote['vote_type'] + '</b> on <a href="' + division['url'] + '">' + division['header'] + '</a>'
                results.append({'type': 'vote', 'description': desc, 'score': 1})
            else:
                desc = 'missed a vote on <a href="' + division['url'] + '">' + division['header'] + '</a>'
                results.append({'type': 'absence', 'description': desc, 'score': -1})
        return results

    def speak_score(self, member_id):
        member_id = str(member_id)
        results = []
        if member_id in self.speak:
            count=len(self.speak[member_id])
            results.append({'type': 'speech', 'description': 'spoke ' + str(count) + ' time(s)', 'score': count})
        return results
        

        
def search_division(xml_string, voting, speak, division_dict, datestr):
    def add_vote(a_mp, a_div_id, a_div_url, a_type, a_maj):
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
            voting[mp_id][a_div_id]=tmp
        else:
            sub_tmp={}
            sub_tmp[a_div_id]=tmp
            voting[mp_id]=sub_tmp
            
    
    def add_division(a_div_url, a_div_text, num_ayes, num_noes):
        a_div_id=a_div_url.split('_')[1]
        if a_div_id not in division_dict:
            tmp={}
            tmp['url']=a_div_url
            tmp['header']=a_div_text
            tmp['date']=datestr
            tmp['ayes']=num_ayes
            tmp['noes']=num_noes     
            
            division_dict[a_div_id]=tmp
                
            
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
    major_heading=root.findall('major-heading')
    
    for division in division_list:
        div_url=division.get('url')
        div_id=div_url.split('_')[1]
        
        public_whip=division.get('id')[25:]
        topic=public_whip.split('.')[2]
        
        div_text='Unknown'
        for headings in major_heading:
            if headings.get('id')[25:].split('.')[2] == topic:
                div_text=headings.text.strip()

        div_count=division.find('divisioncount')
        ayes=div_count.get('ayes')
        noes=div_count.get('noes')
        if ayes>noes:
            major='aye'
        else:
            major='no'
            
        add_division(div_url,div_text, ayes,noes)
        
        for mplist in division.findall('mplist'):
            vote_type=mplist.get('vote')
            for mp in mplist.iterchildren():
                add_vote(mp, div_id, div_url, vote_type, major)

                
                
    speech_list=root.findall('speech')
    for speech in speech_list:
        add_speech(speech)
    
    return voting, speak, division_dict
